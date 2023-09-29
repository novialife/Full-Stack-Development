package main;
import java.util.Arrays;
import java.util.List;

class Game{
    private int randomNum;
    private List<Integer> range = Arrays.asList(1, 100);
    private int NumOfGuesses;
    private boolean status;

    public Game(){
        NumOfGuesses = 0;
        randomNum = (int) ((Math.random() * (range.get(1) - range.get(0))) + range.get(0));
        status = true;
        System.out.println(randomNum);
    }

    public boolean correctGuess(String guess){
        try{
            return (Integer.valueOf(guess) == randomNum);
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public boolean inRange(String guess){
        try {
            return (range.get(0) <= Integer.valueOf(guess) && Integer.valueOf(guess) <= range.get(1));
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public int getNumGuesses(){
        return NumOfGuesses;
    }

    public void setStatus(boolean newStatus){
        status = newStatus;
    }

    public void changeBound(String guess){
        String lowerBound;
		String upperBound;

        if (randomNum <= Integer.valueOf(guess)){
            lowerBound = range.get(0).toString();
            upperBound = guess;
        }else{
            lowerBound = guess;
            upperBound = range.get(1).toString();
        }
        
        range.set(0, Integer.valueOf(lowerBound));
		range.set(1, Integer.valueOf(upperBound));
    }
    
    public void incGuess(){
        NumOfGuesses = NumOfGuesses +1;
    }

    public List<Integer> getBounds(){
        return Arrays.asList(range.get(0), range.get(1));
    }

    public boolean getStatus(){
        return status;
    }
}