var frase="Ok, inte så bra men försök igen";
var Request1 = false;
var sentense1 = "";

var numberCorrect;

if (window.XMLHttpRequest) {
    Request1 = new XMLHttpRequest();
} else if (window.ActiveXObject) {
    Request1 = new ActiveXObject("Microsoft.XMLHTTP");
}

function startQuiz() {
    
   // document.getElementById("inputField1").value = "";
    document.getElementById("trgtP").innerHTML = "";

    if (Request1) {
        var RequestObj1 = document.getElementById("trgtDiv1");
	Request1.open("GET", "challenge1.txt");
	Request1.opened=function(){
	    RequestObj1.innerHTML = "vet inte!";
	}
	

        Request1.onreadystatechange = function() {
            if (Request1.readyState == 4 && Request1.status == 200) {
		RequestObj1.innerHTML = Request1.responseText.trim();
		sentense1 = Request1.responseText.trim();
            }
        }
	
	Request1.send(null);
	
    }


}

function gradeQuiz() {
    
    numberCorrect = 0;
    
    var result1 = document.getElementById("inputField1").value;
    
    var score = document.getElementById("trgtP");
    if (sentense1==result1) {
	frase="Utmärkt!";
        numberCorrect++;
    }
    
    
    document.getElementById("TheForm").style.visibility = "hidden";
    
    score.innerHTML = frase+", Du fick " + numberCorrect + " poäng.";
    
}

