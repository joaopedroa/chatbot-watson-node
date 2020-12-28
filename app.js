const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const prompt = require('prompt-sync')();

const service = new AssistantV2({
  version: '2019-02-28',
  authenticator: new IamAuthenticator({
    apikey: 'uB9tpLPHXhjGJGgN_t8zvXIAvLyj10jxs3J9H1iamKoU',
  })
});

const assistantId = '8f0ac686-333a-4ba6-b63d-487b6f77df92';

var fimConversa = false;

service
  .createSession({
    assistantId,
  })
  .then((res) => {
    sessionId = res.result.session_id;
    sendMessage({
      messageType: 'text',
      text: '',
      options: {
        return_context: true
      }
    });
  })
  .catch(err => {
    console.log(err);
  });


function sendMessage(messageInput) {
  var obj = {
    assistantId,
    sessionId,
    input: messageInput,
  }

  service
    .message(obj)
    .then(res => {
      processResponse(res);
    })
    .catch(err => {
      console.log(err);
    });
}

function processResponse(response) {

  console.log(JSON.stringify(response.result.output.generic));
  
  const intencoes = response.result.output.intents;
  if( intencoes && intencoes.length > 0){
    console.log(intencoes[0].intent);
    if(intencoes[0].intent == "despedir"){
      fimConversa = true;
    }
  }
  
  if(!fimConversa){
    const mensagemUsuario = prompt('>>');
    sendMessage({
      messageType: 'text',
      text: mensagemUsuario,
      options: {
        return_context: true
      }
    });
  }
  

}

function deletarSession() {
  service
    .deleteSession({
      assistantId,
      sessionId,
    })
    .catch(err => {
      console.log(err);
    });
}

