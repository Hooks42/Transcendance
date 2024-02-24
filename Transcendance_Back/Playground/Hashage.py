import random

def Create_Hashing_table():
    key = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', ':', ';', '\"', '\'', '\\', '|', '`', '~', '<', ',', '>', '.', '?', '/', ' ']

    value = list(key)
    random.shuffle(value)
    #print(value)
    Hashing_map = dict()
    for i in range(len(key)):
        Hashing_map[key[i]] = value[i];
    
    return Hashing_map

def Create_Hashing_map():
    Hashing_map = dict()
    for i in range(9):
        Hashing_map[i] = Create_Hashing_table()
        #print(Hashing_map[i], "\n\n\n\n")
    return Hashing_map

def crypt_password(password):
    hashing_tables = Create_Hashing_map()
    random.seed()
    using_table = random.randint(0, 8)
    hashing_table = hashing_tables[using_table]
    print(hashing_table, "\n\n\n\n")
    hashed_password = ""
    for i in range(len(password)):
        hashed_password += hashing_table[password[i]]
    hashed_password += str(using_table)
    print(hashed_password)
    

crypt_password("cedric001")