# flask_graphene_mongo/database.py
from mongoengine import connect

from models import Card

# You can connect to a real mongo server instance by your own.
connect('graphene-mongo-example',
        host='mongomock://localhost',
        alias='default')


def init_db():
    # Create the fixtures
    card1 = Card(name='Tieu Phong',
                 idNumber='3213432',
                 dob='02-12-1980',
                 image='i.jpg')
    card1.save()

    card2 = Card(name='Doan Du',
                 idNumber='1234352',
                 dob='23-01-1980',
                 image='i.jpg')
    card2.save()

    card3 = Card(name='Hu Truc',
                 idNumber='645654',
                 dob='30-03-1980',
                 image='i.jpg')
    card3.save()


def save_card(card):
    print("Card create: ", card)
    card.save()