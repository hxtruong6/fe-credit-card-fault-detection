import gql from 'graphql-tag';


const CREATE_CARD = gql`
mutation CreateCard($idNumber: String!, $name: String!, $dob: String, $address: String, $hometown: String, $cardName: String) {
  createCard(idNumber: $idNumber, name: $name, dob: $dob, address: $address, hometown: $hometown, cardName: $cardName) {
    ok
    card {
      id
      idNumber
      name
      dob
      address
      hometown
      cardName
    }
  }
}
`;

module.exports = {
  CREATE_CARD
};
