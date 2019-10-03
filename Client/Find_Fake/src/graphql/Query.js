import gql from 'graphql-tag';

const ALL_CARDS = gql`
    query AllCards {
        allCards {
            edges {
                node {
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
    } 
`;

module.exports = {
  ALL_CARDS
};
