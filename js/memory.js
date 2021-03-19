function render_board(){
		var index = 0;
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				var span = document.createElement('span');
				span.innerHTML = "<input type='button' style='width:100px;height:100px;font-size:24px;font-weight:bold;color:#19b9cc;' id='b"+index+"' class='board_buttons' value=' ' onclick='player_choice("+index+")'>"
				document.getElementById("board").appendChild(span);
				index++;
			}
			var br = document.createElement("br");
			document.getElementById("board").appendChild(br);
		}
	}

	function get_numbers() {
		var temp_numbers = []

		var i = 0;
		while(i < 8){
			var number = Math.floor(Math.random() * 100) + 1;   // random broj iz intervala [1,100]
			var exist = false;
			for(var j = 0; j < temp_numbers.length; j++){
				if(temp_numbers[j] == number){
					exist = true;
					break;
				}
			}

			if(exist){
				continue;
			}else{
				temp_numbers[i] = number;
				i++;
			} 
		}

		var final_numbers = []
		for(var i = 0; i < temp_numbers.length; i++){
			final_numbers.push(temp_numbers[i]);
		}
		for(var i = 0; i < temp_numbers.length; i++){
			final_numbers.push(temp_numbers[i]);
		}

		for(var i = 0; i < final_numbers.length; i++){
			var random_position = Math.floor(Math.random() * 16);
			var temp = final_numbers[i];
			final_numbers[i] = final_numbers[random_position];
			final_numbers[random_position] = temp; 
		}

		return final_numbers;
	}


	function player_choice(index){

		
		if(number_of_clicks == 0){
			var btn = document.getElementById("b"+index);
			btn.disabled = true;
			btn.value = numbers[index];
			index_of_first_clicked_button = index;
			number_of_clicks++;
		}else{
			var btn = document.getElementById("b"+index);
			btn.disabled = true;
			btn.value = numbers[index];
			var first_clicked_button = document.getElementById("b" + index_of_first_clicked_button);
			number_of_attempts++;
			document.getElementById("number_of_attempts").innerText = number_of_attempts;
			if(first_clicked_button.value == btn.value){
				number_of_matched_pairs++;
				document.getElementById("number_of_matched_pairs").innerText = number_of_matched_pairs;
				if(number_of_matched_pairs == 8){
					alert("Cestitamo !!!");
					update_rang_list();
				}
			}else{
				setTimeout(function () {
					first_clicked_button.value = " ";
					btn.value = " ";
					first_clicked_button.disabled = false;
					btn.disabled = false;
				}, 500);

			}
			var ratio = (number_of_matched_pairs / number_of_attempts) * 100; 
			document.getElementById("ratio").innerText = ratio.toFixed(2);
			number_of_clicks = 0;
		}
	}

	function enable_all_buttons(){

		var index = 0;
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				var btn = document.getElementById("b"+index);
				btn.value = " ";
				btn.disabled = false;
				index++;
			}
		}

	}

	function new_game(){
		number_of_clicks = 0;
		number_of_attempts = 0;
		number_of_matched_pairs = 0;
		numbers = get_numbers();

		document.getElementById("number_of_attempts").innerText = number_of_attempts;
		document.getElementById("number_of_matched_pairs").innerText = number_of_matched_pairs;
		document.getElementById("ratio").innerText = 0;

		enable_all_buttons();

	}

	function render_list(){
		$.get("/statistics", function(data, status){
		    users = data.users;
		    users.sort(function(a,b){return b.score - a.score});
		    var list = document.getElementById("rang_list");
		    for(var i = 0; i < users.length; i++){
		    	var new_list_item = document.createElement("li");
		    	var text = document.createElement("p");
		    	text.id = "list_item";
		    	text.innerHTML = users[i].user + ": " + users[i].score + "%";
		    	new_list_item.appendChild(text);
		    	list.appendChild(new_list_item);
		    }

		});

	}


	function update_rang_list(){
		var score = (number_of_matched_pairs / number_of_attempts) * 100; 
		score = score.toFixed(2);

		var exist = false;
		var changed = false;
		for(var i = 0; i < users.length; i++){
			if(users[i].user == current_user){
				if(users[i].score < score){
					users[i].score = score;
					changed = true;
				}
				exist = true;
				break;
			}
		}

		if(!exist){
			users.push({user:current_user,score:score});

		}

		if(!exist || changed){
			users.sort(function(a,b){return b.score-a.score});
			$.post("/statistics",
				  {
				    users: users
				  },
				  function(data, status){
				  	render_rang_list();
				  });

		}
			
	}

	function render_rang_list(){
		var list = document.getElementById("rang_list");
		list.innerHTML = "";
		for(var i = 0; i < users.length; i++){
		    var new_list_item = document.createElement("li");
		    var text = document.createElement("p");
		    text.id="list_item";
		    text.innerHTML = users[i].user + ": " + users[i].score + "%";
		    new_list_item.appendChild(text);
		    list.appendChild(new_list_item);
		}

	}


	

	numbers = get_numbers();
	var number_of_clicks = 0;
	var index_of_first_clicked_button;
	var number_of_attempts = 0;
	var number_of_matched_pairs = 0;

	document.getElementById("user").innerHTML = localStorage.getItem("username");
	var current_user = localStorage.getItem("username");
	var users;

	render_board();
	render_list();