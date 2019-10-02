import gql from 'graphql-tag'

export const ALL_CARDS = gql`
    query AllCards {
        allCards {
            edges {
                node {
                    id
                    idNumber
                    name
                    image
                }
            }
        }
    } 
`