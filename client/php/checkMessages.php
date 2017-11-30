<?php

// this make the string of * depending on the size of the word found
function censorship($swearWord){
    $censor = "";
    for($i = 0; $i < strlen($swearWord); $i++){
        $censor = $censor."*";
    }
    return $censor;
}

/*

// PHP (func.php)
function myfunc($args); // some function to call
function anotherfunc($args); // some other function

$method = resolve_func($_POST['method']); // function to run
$args = json_decode($_POST['args']); // arguments as JSON object

$method->run($args); // Function would print return as JSON

// JS
$.ajax({
        type: "POST",
        url:"func.php",
        dataType: "json",
        data: { args : tostring(argument), method: 'myfunc' }, // tostring prob isn't real
        success: function( data, status ) {
            // do stuff with return
        },
        complete: function(data,status) { //optional, used for debugging purposes
        //alert(status);
        }
});

*/

function findSwearwords($message){
    // echo $message."<br>";
    $lines = explode("\n", file_get_contents('../extra/word.txt'));
    foreach($lines as $find){
        $censor = censorship($find);

        $index = 0;
        $size = strlen($find);
        $positions = array();
        for($i = 0; $i<strlen($message); $i++){
            $pos = strpos($message, $find, $index);
            if($pos == $index){
                $positions[] = $pos;
            }
            if($pos != 0){
                $word = substr($message, $pos, $size);
                $newWord = str_replace($word, $censor, $message);
                $message = $newWord;
            }
                $index++;
        }
    }
    // echo $message;
    return $message;
}

// $valueFromClient = $_POST['$scope.userText'];
// findSwearwords($valueFromClient);
?>
