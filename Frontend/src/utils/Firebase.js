const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
// const admin = require("firebase-admin");

// const serviceAccount = {
//   type: "service_account",
//   project_id: "csci5409-sdp9-project",
//   private_key_id: "46bcba5110bc85e7d19e7aa720f90f98674d0130",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDBugl7tCQHa+S+\n2v2xfGcI/jWpEyzeKmyztg1ORqhJM3Gob7n00vIEjyXM7hb58m3NWhvOAYTe0lKh\nr8KF62xA/UzF8ScsjSCK1hK2TolxpyprKa4e+nKNaW68LQKuQ/1BLkbwzswUGHnw\nYyjC/v2TkHDOh+t2Em7YUPRIL+Q+JXS4MlPZA/ZxVsdrwtWCF5chZyer8Bghu0Qr\nIaFPOAal/ykeizVrtoKuzvTA8Sj5+oGCnLhPhPlzKyFQ+Hha8hdCtE1JeDNqEEzo\ndiLVmkYEGDI1qXvjzG3VmoOSAs+mkiJHLpuKg11UDbrmQlmRfCcFGE5+85NRe/NO\nZJg3MLYtAgMBAAECggEAHBOknrVZuGqidSfDd2b2fubq64VwLgW7ieMzc/oJF0zZ\npuYEby9obJE7kwMZuOFyGP47g+ST94BHgg/5UxPu9U9QwmpkOVB93ClQ/nOM93gZ\nDX11sx8snYKfji2+0vdfG8SDexCZorr2Z0jTxkkTAsE/HCu2TD85Keg3s0OfooLl\n8K1bHd6iPnpIpv/oDF1BYNmtyfFxo+FtRW475nryioA+1JyZ7YUdUYIHvzaHOtvI\n0M/IidyT9Paj85fS3uPnrg1ULQIhCCLOIr0my1qhPxapu1kKXWnJHKImoY/jScVg\ntLQo+ypa+poUT4LLkcSnWmWe2MHWpZ4t0JgGdcNyuQKBgQDxQxh7SZ/LcLKoBCKO\njNgSap6lGvGN9RgyMR7L75Dp3I2BBOF6bWs70pvQ+cl3pdZ3Gt/Vijt7Slb3u2SJ\n9M0jXjIjwkA/bvbAQFxcUk/TU0ftB4Kpqx74PxoZEByo1UfXoCh3MII8CKCc+ev5\n3a8IFuszrudLtleo0Z5iDbbo9QKBgQDNj5Lan2TraYZ9589OxgvgwNyjwUC+86a2\nIHxCIJTpjUkOt+bpQq84bINshAeS45nWfhCvRjlRzu03iFY7ScowV1M9IjhPIGLR\nmzP3KWL40CXozQWFx3JfVY2Km9AtEPJ30oWdZHkavxIFNlNQBWgq5w+9hvftMhKh\n3Ajsg4M1WQKBgHHWUdfibmakv3ets8yFQnK2IjMPWoi76/XK3Zgmar8eFRqaffWx\naVap0mGxatFsy5wZbyIn/lb3Rb/QiOjbPGwCxy++OWh06DLga3QYVpgFBLwfvhRm\nrM8/nwXSZ2N2d1aTuGQ83EaNX5OSDTkx06PChKo3TeWYnRYICm6DwBl9AoGASQ6J\n5uFXgMNUZVMJvrlsZ0ikIh8A39zAl2IcR3RE+GyaVnzNuIFWvPr0CpEyD+aMOks7\nqs+Od6DPdjkiTJgBIAUpNEUBNj4QYOaEJYe0ATIZBxA2skEcSP2i/Gw8JIgtZKCR\nlEqtL/BQe0G/gmUpjHXqhjV9z/NH4/bLxSNIcqECgYBvBl/tqCCYVbZh7Am5kdOf\nYrIL8/2vKn4pcECP/9f2H+WlQQI58tHiuRzrn4ePsv3PgXwmUlpH4Beo2HmW7kil\ncTIw02xzktu5W6BI6DIe2yzIHLW1dUCBj1DN5alxOV7zJWWMEF/rQOpe/E1iDB9F\nO4eYtc7pyobd1m0kch9H8w==\n-----END PRIVATE KEY-----\n",
//   client_email:
//     "firebase-adminsdk-6wj4l@csci5409-sdp9-project.iam.gserviceaccount.com",
//   client_id: "112730791271688868612",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6wj4l%40csci5409-sdp9-project.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDkLTXkX-cWf-t8TdCdn8Pa0tNHv23Gqes",
  authDomain: "csci5409-sdp9-project.firebaseapp.com",
  projectId: "csci5409-sdp9-project",
  storageBucket: "csci5409-sdp9-project.appspot.com",
  messagingSenderId: "765770256271",
  appId: "1:765770256271:web:9b931338b2c736b5f585fa",
  measurementId: "G-60KJQ11CH0",
};

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://csci5409-sdp9-project.firebaseio.com",
// });

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
// const authAdmin = admin.auth();

module.exports = { auth, firebase }; //, authAdmin, firebase };
