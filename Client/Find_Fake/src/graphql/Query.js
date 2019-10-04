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

export {
  ALL_CARDS
};
