#Info on the deck
ranks = ["Ace","2","3","4","5","6","7","8","9","10","J","Queen","King"]
suits = ["Hearts","Diamonds","Clubs","Spades"]
s_ranks = ["Joker"]
s_suits = ["Black","Red"]

#Loops for variety

for rank in ranks:
    for suit in suits:
        print(rank+" : "+suit)

for s_rank in s_ranks:
    for s_suit in s_suits:
        print(s_rank+" : "+s_suit)
