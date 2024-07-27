from logic import Symbol, Not, And, Or, Implication, Biconditional, model_check

# Define symbols
A = Symbol("A")
B = Symbol("B")
C = Symbol("C")

# Puzzle 0
knowledge0 = And(
    Biconditional(A, And(A, Not(A)))  # A says, "I am both a knight and a knave."
)

# Puzzle 1
knowledge1 = And(
    Biconditional(A, And(Not(A), Not(B)))  # A says, "We are both knaves."
)

# Puzzle 2
knowledge2 = And(
    Biconditional(A, Biconditional(A, B)),  # A says, "We are the same kind."
    Biconditional(B, Not(Biconditional(A, B)))  # B says, "We are of different kinds."
)

# Puzzle 3
knowledge3 = And(
    Biconditional(A, Or(A, Not(A))),  # A says either "I am a knight" or "I am a knave."
    Implication(B, Not(A)),           # B says A said "I am a knave."
    Implication(B, Not(C)),           # B says C is a knave.
    Implication(C, A)                 # C says A is a knight.
)

# Function to evaluate and print puzzle solutions
def evaluate_puzzles():
    for i, knowledge in enumerate([knowledge0, knowledge1, knowledge2, knowledge3]):
        print(f"Puzzle {i}:")
        for symbol in [A, B, C]:
            if model_check(knowledge, symbol):
                print(f"{symbol}: Knight")
            elif model_check(knowledge, Not(symbol)):
                print(f"{symbol}: Knave")
            else:
                print(f"{symbol}: Unknown") 
        print("-----")

# Run the puzzle evaluation
if __name__ == "__main__":
    evaluate_puzzles()
