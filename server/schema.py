# flask_graphene_mongo/schema.py
import graphene
from graphene.relay import Node
from graphene_mongo import MongoengineConnectionField, MongoengineObjectType
from models import Card as CardModel
from database import save_card as SaveCard


class Card(MongoengineObjectType):
    class Meta:
        model = CardModel
        interfaces = (Node, )


# Used to Create Card
class CreateCard(graphene.Mutation):
    class Arguments:
        idNumber = graphene.String(required=True)
        name = graphene.String()
        dob = graphene.String()
        address = graphene.String()
        hometown = graphene.String()
        cardName = graphene.String()

    ok = graphene.Boolean()
    card = graphene.Field(lambda: Card)

    def mutate(root,
               info,
               idNumber,
               name,
               dob=None,
               address=None,
               hometown=None,
               cardName=None):
        card = CardModel(
            idNumber=idNumber,
            name=name,
            dob=dob,
            address=address,
            hometown=hometown,
            cardName=cardName,
        )
        ok = True
        SaveCard(card)
        return CreateCard(card=card, ok=ok)


class Query(graphene.ObjectType):
    node = Node.Field()
    all_cards = MongoengineConnectionField(Card)


class Mutations(graphene.ObjectType):
    create_card = CreateCard.Field()


schema = graphene.Schema(query=Query, mutation=Mutations, types=[Card])
