////////////////////////////////////////////////////////////////////////
//                  JS-CODE FOR Bandits Experiment                    //
//                       AUTHOR: ERIC SCHULZ                          //
//                       TUEBINGEN, May 2022                          //
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
//INTIALIZE 
////////////////////////////////////////////////////////////////////////

//data storage ref
var n_trials = 10,//number of trials
  n_blocks = 10,//number of blocks
  trial = 0,//trial counter
  block = 0,//block counter
  out = 0,//outcome
  total_score = 0,//total score
  index = 0,//index
  age = 0,//age of participant
  gender = 0,//gender of participant
  inst_counter = 0,//instruction counter
  overall_score = 0,//overall score
  x_collect = [],//collecting the selected position
  y_collect = [],//collecting the returned output
  time_collect = [],//collection the timestamps
  x = [],//underlying position
  y = [],//underlying outcome
  timeInMs = 0,//reaction time
  letter = '<input type="image" src="letters/',//the letter
  p_specs = '.png"  width="120" height="120"'//size of box

//borders for selections
var borders = ['border="1">', 'border="1">'];

//letter boxes and their borders
var b1 = letter + 'F' + p_specs + borders[0],
  b2 = letter + 'J' + p_specs + borders[1];

//generating lists to collect the outcomes
for (var i = 0; i < n_blocks; i++) {
  //outcomes of arm positions
  x_collect[i] = Array.apply(null, Array(0)).map(Number.prototype.valueOf, -99);
  //outcome of y position
  y_collect[i] = Array.apply(null, Array(0)).map(Number.prototype.valueOf, -99);
  //timestamp collection
  time_collect[i] = Array.apply(null, Array(0)).map(Number.prototype.valueOf, -99);
}


////////////////////////////////////////////////////////////////////////
//CREATE HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////

//function to hide one html div and show another
function clickStart(hide, show) {
  document.getElementById(hide).style.display = 'none';
  document.getElementById(show).style.display = 'block';
  window.scrollTo(0, 0);
}

//changes inner HTML of div with ID=x to y
function change(x, y) {
  document.getElementById(x).innerHTML = y;
}

//Hides div with id=x
function hide(x) {
  document.getElementById(x).style.display = 'none';
}

//shows div with id=x
function show(x) {
  document.getElementById(x).style.display = 'block';
  window.scrollTo(0, 0);
}

//creates a random number between min and max
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//permute a list
function permute(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

//Display a float to a fixed precision
function toFixed(value, precision) {
  var precision = precision || 0,
    power = Math.pow(10, precision),
    absValue = Math.abs(Math.round(value * power)),
    result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));

  if (precision > 0) {
    var fraction = String(absValue % power),
      padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
    result += '.' + padding + fraction;
  }
  return result;
}

//standard normal using Box-Mueller algorithm
function myNorm() {
  var x1, x2, rad, c;
  do {
    x1 = 2 * Math.random() - 1;
    x2 = 2 * Math.random() - 1;
    rad = x1 * x1 + x2 * x2;
  } while (rad >= 1 || rad == 0);
  c = Math.sqrt(-2 * Math.log(rad) / rad);
  return (x1 * c);
};

////////////////////////////////////////////////////////////////////////
//Instruction Check
////////////////////////////////////////////////////////////////////////
var turkID = 0;
function getting_started() {
  turkID = document.getElementById("turkID").value;
  if (turkID == "WorkerID") {
    alert("Please provide your Mechanical Turk Worker ID. We will need your ID for paying the bonus.");
  } else {
    clickStart("page3", "page4");
  }
}

function instruction_check() {
  //check if correct answers are provided
  if (document.getElementById('i_check_1').checked) { var ch1 = 1 }
  if (document.getElementById('i_check_2').checked) { var ch2 = 1 }
  if (document.getElementById('i_check_3').checked) { var ch3 = 1 }
  //are all of the correct
  var checksum = ch1 + ch2 + ch3;
  if (checksum === 3) {
    //if correct, continue
    begin_trial();
    clickStart('page7', 'page8');
    //alert
    alert('Great, you have answered all of the questions correctly. The study will now start.');
  } else {
    inst_counter++;
    //if one or more answers are wrong, raise alert box
    alert('You have answered some of the questions wrong. Please try again.');
    //go back to instructions
    clickStart('page7', 'page4');
  }
}

////////////////////////////////////////////////////////////////////////
//Experiment
////////////////////////////////////////////////////////////////////////

//this function initializes a trial
function begin_trial() {
  //only allowing for one press
  var return_pressed = 0;
  //initialize time count
  timeInMs = Date.now()
  //get the pressed key
  $(document).keypress(function (e) {
    //if the key equals A
    if (e.which == 97 & return_pressed == 0) {
      //indicate that something has been pressed          
      return_pressed = 1;
      //get the time that has passed
      timeInMs = Date.now() - timeInMs;
      //call the function for that position
      my_func(0);
    }
    //same spiel if key equals S      
    if (e.which == 115 & return_pressed == 0) {
      return_pressed = 1;
      timeInMs = Date.now() - timeInMs;
      my_func(1);
    }
    //same spiel if key equals D      
    if (e.which == 100 & return_pressed == 0) {
      return_pressed = 1;
      timeInMs = Date.now() - timeInMs;
      my_func(2);
    }
    //same spiel if key equals F       
    if (e.which == 102 & return_pressed == 0) {
      return_pressed = 1;
      timeInMs = Date.now() - timeInMs;
      my_func(3);
    }
    //same spiel if key equals J
    if (e.which == 106 & return_pressed == 0) {
      return_pressed = 1;
      timeInMs = Date.now() - timeInMs;
      my_func(4);
    }
    //same spiel if key equals K      
    if (e.which == 107 & return_pressed == 0) {
      return_pressed = 1;
      timeInMs = Date.now() - timeInMs;
      my_func(5);
    }
    //same spiel if key equals L      
    if (e.which == 108 & return_pressed == 0) {
      return_pressed = 1;
      timeInMs = Date.now() - timeInMs;
      my_func(6);
    }
    //same spiel if key equals ;
    if (e.which == 59 & return_pressed == 0) {
      return_pressed = 1;
      timeInMs = Date.now() - timeInMs;
      my_func(7);
    }
  }
  );
}

//function to draw the letter boxes into the HTML
function draw_letters() {
  change('arm1', b1);
  change('arm2', b2);
}

//do this once at start
draw_letters();

//function that executes the bandit
function my_func(inp) {
  //loop through all possible locations
  for (i = 0; i < 8; i++) {
    //if the chosen location matches possible location
    if (inp == i) {
      //return always 20
      out = 20;
      //collect corresponding location, it's only important for R to JS differences        
    }
  }
  x_collect[block][trial] = inp;
  //collect returned value
  y_collect[block][trial] = out;
  //collect reaction time
  time_collect[block][trial] = timeInMs;
  //mark the selected option
  borders[inp] = 'border="4">';
  //update letter boxes
  b1 = letter + 'F' + p_specs + borders[0];
  b2 = letter + 'J' + p_specs + borders[1];
  //draw the option with their letters, now the chosen one has a thicker frame
  draw_letters();
  //show rounded value
  var out_show = toFixed(out, 1);
  //display on screen
  change('outcome', "Outcome: " + out_show);
  //set a time out, after 2 seconds start the next trial
  setTimeout(function () { next_trial(); }, 2000);
}


function next_trial() {
  //check if trials are smaller than the maximum trial number
  if (trial + 1 < n_trials) {
    //set the borders back to normal
    borders = ['border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">'];
    //change the letters again
    b1 = letter + 'F' + p_specs + borders[0];
    b2 = letter + 'J' + p_specs + borders[1];
    //draw options and their letters
    draw_letters();
    //begin new trial
    begin_trial();
    //track total score
    total_score = total_score + out;
    //to be inserted total score
    var inserts = 'Total Score: ' + toFixed(total_score, 1);
    //show total score on screen
    change('score', inserts);
    //increment trial number
    trial++;
    //to be inserted number of trials left
    var insert_ = 'Number of trials left: ' + (n_trials - trial);
    //show on screen
    change('remain', insert_);
    //change outcome back to please choose an option
    change('outcome', "Please choose an option!");
  }
  //if trial numbers exceed the total number, check if more blocks are available
  else if (trial + 1 == n_trials & block + 1 < n_blocks) {
    //tell them that this block is over
    alert("Block " + (block + 1) + " out of 5 is over. Please press return to continue with the next block.")
    //start next block
    next_block();
  } else {
    //Otherwise --if blocks exceed total block number, then the experiment is over
    alert("The experiment is over. You will now be directed to the next page.")
    clickStart('page8', 'page9');
  }
}

//function to initialize next block
function next_block() {
  //update overall score
  overall_score = overall_score + total_score;
  //borders back to normal
  borders = ['border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">', 'border="1">'];
  //new letters and boxes
  b1 = letter + 'F' + p_specs + borders[0];
  b2 = letter + 'J' + p_specs + borders[1];
  //draw options
  draw_letters();
  //begin a new trial
  begin_trial();
  //increment block number
  block++;
  //set trial number back to 0
  trial = 0;
  //total score back to 0
  total_score = 0;
  //insert total score
  var inserts = 'Total Score: ' + toFixed(total_score, 1);
  //put on screen
  change('score', inserts);
  //number of trials left
  var insert_ = 'Number of trials left: ' + (n_trials - trial);
  //on screen
  change('remain', insert_);
  //ask them to choose an outcome
  change('outcome', "Please choose an option!");
}

////////////////////////////////////////////////////////////////////////
//Demographics & Finish
////////////////////////////////////////////////////////////////////////
//sets the selected gender
function set_gender(x) {
  gender = x;
  return (gender)
}

//sets the selected age
function set_age(x) {
  age = x;
  return (age)
}

//data to save string to downloads
function saveText(text, filename) {
  //create document
  var a = document.createElement('a');
  //set ref
  a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
  //to download
  a.setAttribute('download', filename);
  //submit
  a.click()
}

function my_submit() {
  //change page
  clickStart('page9', 'page10');
  //calculate score
  var present_total = 'You have gained a total score of ' + toFixed(overall_score, 1) + '.';
  //calculate money earned
  var money = 2 + 1.5 * (overall_score / (50 * n_blocks * n_trials));
  money_p = toFixed(money, 2);
  var present_money = 'This equals a total reward of $' + money_p + '.';
  //show score and money
  change('result', present_total);
  change('money', present_money);
  //all data to save
  saveDataArray = {
    'x_collect': x_collect,
    'y_collect': y_collect,
    'time_collect': time_collect,
    'money': money,
    'age': age,
    'inst_counter': inst_counter,
    'turkID': turkID,

  };
  //save data
  saveText(JSON.stringify(saveDataArray), 'banditData.' + turkID + '.JSON');
}
////////////////////////////////////////////////////////////////////////
//The END
////////////////////////////////////////////////////////////////////////
