package main;

public class GuessGame {
    private int correctValue;
    private int lowerBound;
    private int upperBound;
    private int guesses;
    private String message;
    private boolean gameOver;

    GuessGame() {
        this.initGame();
    }

    public void initGame() {
        this.lowerBound = 1;
        this.upperBound = 100;
        this.correctValue = (int) (Math.random() * 99 + 1);
        this.guesses = 0;
        this.gameOver = false;
        this.message = "Enter your guess!";
    }

    private boolean correctGuess(int guess) {
        if (guess == this.correctValue){
            this.message = "You guessed correct!";
            this.gameOver = true;
            return true;
        }
        return false;
    }

    private boolean inBound(int guess) {
        if (guess > this.upperBound || guess < this.lowerBound) {
            this.message = "Guess is out of bounds";
            return false;
        } 
        return true;
    }

    private void updateBound(int guess) {
        if (guess > this.correctValue) {
            this.upperBound = guess;
        } else {
            this.lowerBound = guess;
        }
        this.message = "Your guess is not correct! Try again!";
    }    

    public void guess(int guess) {
        if (!this.inBound(guess)) {
            return;
        }
        this.guesses ++;
        if (this.correctGuess(guess)) {
            return;
        }
        this.updateBound(guess);
        return;
    }
    
    public boolean getGameStatus() {
        return this.gameOver;
    }

    public String getMessage() {
        return this.message;
    }

    public int getGuesses() {
        return this.guesses;
    }

    public int getCorrect() {
        return this.correctValue;
    }

    public String[] getBounds() {
        String[] bounds = {Integer.toString(this.lowerBound), Integer.toString(this.upperBound)};
        return bounds;
    }
}
