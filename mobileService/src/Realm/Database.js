import Realm from "realm";
/**
 * User do realm do usuário atual
 */
let realmUser;
/**
 *  Realm aberto do usuário atual
 */
let realm;
/**
 * User do Realm Temporário
 */
let tempRealmUser;
/**
 * Setter da lista de contatos
 */
let setContact;

/**
 * MessageSchema para o Realm
 */
const Message = {
  name: "message",
  properties: {
    _id: "string",
    _partition: "string",
    createdAt: "date",
    receiverId: "string",
    receiverName: "string",
    senderId: "string",
    senderName: "string",
    text: "string",
  },
  primaryKey: "_id",
};
/**
 * ContactSchema para o Realm
 */
const contactSchema = {
  name: "contact",
  properties: {
    _id: "string",
    _partition: "string",
    contactEmail: "string",
    contactId: "string",
    contactName: "string",
    lastMessage: "string",
    createdAt: "date",
  },
  primaryKey: "_id",
};

/**
 * Configs padrões para abrir o Realm
 * ID é o id do app no servidor
 * Timeout é o tempo de resposta máxima para conexão com o servidor
 */
const realmApp = new Realm.App({
  id: "mobileservice-bjxbl",
  timeout: 10000,
});

/**
 * Seta na Database qual vai ser a função para atualizar a lista de contatos
 * @param {function} todo Função para setar a lista de contatos no componente atual
 */
const setarSetContact = (todo) => {
  setContact = todo;
};

/**
 * Setter para definir o TempUser atual
 * @param {string} CPF cpf cadastrado no REALM para logar
 */
const setTempRealmUser = async (CPF) => {
  tempRealmUser = await realmApp.logIn(
    Realm.Credentials.emailPassword(CPF, "12345678")
  );
};

/**
 * Função para registrar o usuário no realm
 * @param {string} CPF cpf para cadastrar no REALM para logar
 * @returns realmID do usuário recem criado
 */
async function registerUser(CPF) {
  try {
    await realmApp.emailPasswordAuth.registerUser(CPF, "12345678");
  } catch (e) {
    console.log(e);
  }
  realmUser = await realmApp.logIn(
    Realm.Credentials.emailPassword(CPF, "12345678")
  );
  const newUserId = realmUser.id;
  realmUser.logOut();
  return newUserId;
}

/**
 * Faz login no Realm para definir o user Atual
 * @param {string} CPF cpf cadastrado no REALM para logar
 */
async function createUser(CPF) {
  realmUser = await realmApp.logIn(
    Realm.Credentials.emailPassword(CPF, "12345678")
  );
}

/**
 * Cria o Realm do usuário logado
 */
const createRealm = async () => {
  realm = await Realm.open({
    schema: [Message, contactSchema],
    sync: {
      user: realmUser,
      partitionValue: realmUser.id,
      existingRealmFileBehavior: { type: "openImmediately" },
      newRealmFileBehavior: { type: "openImmediately" },
    },
  });
};

/**
 * Getter para lista de contatos
 * @returns Retorna um realm.objects com a lista de contatos do usuário logado
 */
const getContacts = () => {
  return realm.objects(contactSchema.name);
};

/**
 * Cria listeners no realm para quando houver novo contato na lista ou mensagem nova recebida
 * @param {function} setMessage setter para atualizar as mensagens da tela
 */
const createRealmListener = (setMessage) => {
  /**
   * Função para settar as mensagens novas, disparada quando o listener de mudança de mensages ativar
   * @param {[{_id:string, _partition:string,createdAt:Date,text:string,senderId:string,receiverId:string}]} message Lista de mensagens do realm
   */
  function onMessageChange(message, changes) {
    let mensagens = [];
    message = message.filter((element) => {
      return (
        element.senderId == tempRealmUser.id ||
        element.receiverId == tempRealmUser.id
      );
    });
    message.map((mensagem) => {
      mensagens = mensagens.concat({
        _id: mensagem._id,
        _partition: mensagem._partition,
        createdAt: mensagem.createdAt,
        user: quemMandouMensagem(mensagem, tempRealmUser.id, realmUser.id),
        text: mensagem.text,
      });
    });
    setMessage(sortByDate(mensagens));
  }

  /**
   * Função para settar os contatos novos, disparada quando o listener de mudança de contatos ativar
   * @param {[{contactId:string, contactName:string, lastMessage:string, contactEmail:string, createdAt:Date}]} contact Array com lista de mensagens atuais
   */
  function onContactChange(contact, changes) {
    let contacts = [];
    contact.map((contato) => {
      let word = contato.lastMessage;
      while (word.search("\n") != -1) {
        word = word.replace("\n", "  ");
        console.log(word.search("\n"));
      }
      contacts = contacts.concat({
        id: contato.contactId,
        nome: contato.contactName,
        lastMessage: word,
        email: contato.contactEmail,
        createdAt: contato.createdAt,
      });
    });
    const sortedContacts = sortByDate(contacts);
    setContact(sortedContacts);
  }

  const messagesListener = realm.objects(Message.name);
  messagesListener.addListener(onMessageChange);
  const contactsListener = realm.objects(contactSchema.name);
  contactsListener.addListener(onContactChange);
};

/**
 *
 * @param {string} _id OID da mensagem criada
 * @param {string} contact Nome do contato
 * @param {string} text Texto da mensagem
 * @param {string} nome Nome do usuário
 */
async function createMessage(_id, contact, text, nome) {
  const lastMessage = `${text.slice(0, 26)}${text.length >= 27 ? "..." : ""}`;
  const actualHour = new Date();
  const contactList = realm
    .objects(contactSchema.name)
    .filtered(`contactId =="${tempRealmUser.id}"`)[0];
  await realm.write(async () => {
    realm.create("message", {
      //colocando no Realm do usuário que mandou a mensagem
      _id: `${_id}-${realmUser.id}`,
      _partition: realmUser.id,
      createdAt: new Date(),
      receiverId: tempRealmUser.id,
      receiverName: contact,
      text: text,
      senderId: realmUser.id,
      senderName: nome,
    });

    contactList.lastMessage = lastMessage;
    contactList.createdAt = actualHour;
  });
  //criando realm do contato
  let tempRealm = await Realm.open({
    schema: [Message, contactSchema],
    sync: {
      user: tempRealmUser,
      partitionValue: tempRealmUser.id,
      existingRealmFileBehavior: { type: "openImmediately" },
      newRealmFileBehavior: { type: "openImmediately" },
    },
  });

  tempRealm.write(async () => {
    //colocando no Realm do contato
    await tempRealm.create("message", {
      _id: `${_id}-${tempRealmUser.id}`,
      _partition: tempRealmUser.id,
      createdAt: new Date(),
      receiverId: tempRealmUser.id,
      receiverName: contact,
      text: text,
      senderId: realmUser.id,
      senderName: nome,
    });
  });
  tempRealm.write(() => {
    const tempContactList = tempRealm
      .objects(contactSchema.name)
      .filtered(`contactId =="${realmUser.id}"`)[0];
    tempContactList.lastMessage = lastMessage;
    tempContactList.createdAt = actualHour;
  });
  tempRealm = undefined;
}

/**
 * Adicionar contato na lista do profissional e cliente
 * @param {string} _id OID do objeto
 * @param {string} profEmail email do profissional
 * @param {string} clienteName nome do Cliente
 * @param {string} profName nome do profissional
 */
async function createContact(_id, profEmail, clienteName, profName) {
  setTempRealmUser(profEmail).then(async () => {
    if (
      realm
        .objects(contactSchema.name)
        .filtered(`contactId =="${tempRealmUser.id}"`).length == 0
    ) {
      const tempRealm = await Realm.open({
        schema: [Message, contactSchema],
        sync: {
          user: tempRealmUser,
          partitionValue: tempRealmUser.id,
          existingRealmFileBehavior: { type: "openImmediately" },
          newRealmFileBehavior: { type: "openImmediately" },
        },
      });
      await tempRealm.write(async () => {
        const lastMessage = `Converse com ${clienteName}`;
        tempRealm.create("contact", {
          //colocando no Realm do usuário Profissional
          _id: `${_id}-${tempRealmUser.id}`,
          _partition: tempRealmUser.id,
          contactId: realmUser.id,
          contactName: clienteName,
          contactEmail: realmUser.profile.email,
          lastMessage: `${lastMessage.slice(0, 26)}${
            lastMessage.length >= 27 ? "..." : ""
          }`,
          createdAt: new Date(),
        });
      });
      await realm.write(async () => {
        const lastMessage = `Converse com ${profName}`;
        realm.create("contact", {
          //Colocando no Realm do Cliente
          _id: `${_id}-${realmUser.id}`,
          _partition: realmUser.id,
          contactId: tempRealmUser.id,
          contactName: profName,
          contactEmail: tempRealmUser.profile.email,
          lastMessage: `${lastMessage.slice(0, 26)}${
            lastMessage.length >= 27 ? "..." : ""
          }`,
          createdAt: new Date(),
        });
      });
    }
  });
}

/**
 * Ordenador de objetos seguindo o CreatedAt como parâmetro
 * @param {[createdAt:Date]} data Array com valores a serem ordenados pelo CreatedAt
 * @returns Array com objetos ordenados
 */
const sortByDate = (data) => {
  return data.sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    else if (a.createdAt > b.createdAt) return -1;
    else return 0;
  });
};

/**
 * Insere a mensagem e então verifica qual dos dois usuários mandaram ela para uso posterior no GiftedChat
 * @param {{senderId: string, senderName:string, receiverName:string}} user Dados do sender e do receiver
 * @param {string} contactId realmID do contato
 * @param {string} myId realmID do user
 * @returns Objeto para inserção e uso no GiftedChat
 */
const quemMandouMensagem = (
  { senderId, senderName, receiverName },
  contactId,
  myId
) => {
  if (senderId == contactId) {
    //* separador pra saber se a mensagem puxada é
    //* do usuario ou do contato que está conversando
    return {
      _id: senderId,
      name: senderName,
    };
  } else {
    return {
      _id: myId,
      name: receiverName,
    };
  }
};

export {
  createMessage,
  createRealm,
  createUser,
  registerUser,
  setTempRealmUser,
  createRealmListener,
  getContacts,
  createContact,
  setarSetContact,
  sortByDate,
};
