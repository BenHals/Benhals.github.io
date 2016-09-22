var modelBase = function(controller){
	this.dataSplit = null;
	this.dataType = [["number"],["group"]];
	this.inputData = [];
	this.dataHeadings = ["test","test","test","test","test"];
	this.display = null;
	this.stats = [["Mean","Median"],["proportion"],["slope"]];
	this.controller = controller;
	this.currentCategory = null;
	this.currentDisplayType =0;
	this.fileName = "no current file"
	this.storedData = 
		{
		'olympics100m.csv':"YEAR,NAME,TIME,location,Gender\n1896,Tom Burke,12,USA,male\n1900,Frank Jarvis,11,USA,male\n1904,Archie Hahn,11,USA,male\n1906,Archie Hahn,11.2,USA,male\n1908,Reggie Walker,10.8,SAF,male\n1912,Ralph Craig,10.8,USA,male\n1920,Charles Paddock,10.8,USA,male\n1924,Harold Abrahams,10.6,GBR,male\n1928,Percy Williams,10.8,CAN,male\n1932,Eddie Tolan,10.38,USA,male\n1936,Jesse Owens,10.3,USA,male\n1948,Harrison Dillard,10.3,USA,male\n1952,Lindy Remigino,10.4,USA,male\n1956,Bobby Morrow,10.5,USA,male\n1960,Armin Hary,10.2,GER,male\n1964,Bob Hayes,10,USA,male\n1968,Jim Hines,9.95,USA,male\n1972,Valery Borzov,10.14,URS,male\n1976,Hasely Crawford,10.06,TRI,male\n1980,Allan Wells,10.25,GBR,male\n1984,Carl Lewis,9.99,USA,male\n1988,Carl Lewis,9.92,USA,male\n1992,Linford Christie,9.96,GBR,male\n1996,Donovan Bailey,9.84,CAN,male\n2000,Maurice Greene,9.87,USA,male\n2004,Justin Gatlin,9.85,USA,male\n2008,Usain Bolt,9.69,JAM,male\n2012,Usain Bolt,9.63,JAM,male\n2012,Shelly-Ann FRASER-PRYCE,10.75, JAM,female\n2008,Shelly-Ann FRASER-PRYCE,10.78, JAM,female\n2004,Yuliya NESTSIARENKA,10.93, BLR,female\n2000,,,,\n1996,Gail DEVERS,10.94, USA,female\n1992,Gail DEVERS,10.82, USA,female\n1988,Florence GRIFFITH JOYNER,10.54 , USA,female\n1984,Evelyn ASHFORD,10.97, USA,female\n1980,Lyudmila KONDRATYEVA,11.06, URS,female\n1972,Renate STECHER,11.07, GDR,female\n1968,Wyomia TYUS,11, USA,female\n1964,Wyomia TYUS,11.4, USA,female\n1960,Wilma RUDOLPH,11, USA,female\n1956,Betty CUTHBERT,11.5, AUS,female\n1952,Marjorie JACKSON,11.5, AUS,female\n1948,Fanny BLANKERS-KOEN,11.9, NED,female\n1936,Helen STEPHENS,11.5, USA,female\n1932,Stanislawa WALASIEWICZ,11.9, POL,female\n1928,Elizabeth ROBINSON,12.2, USA,female\n"
		};
}
modelBase.prototype.getPresets = function(){
	return ["olympics100m.csv"];
}
modelBase.prototype.loadFromPreset = function(filename){
		this.controller.setUpDataVeiw(this.storedData[filename]);
}
modelBase.prototype.loadData = function(){
		this.dataSplit = [];
		var lines = this.testingData.split('\n');
		var headings = lines[0].split(',');
		for(var k =0; k<headings.length;k++){
			this.dataSplit.push([headings[k]]);
		}
		this.inputData = [];
		for(var i = 1;i < lines.length;i++){
			var inputItem = new Object();
			var thisLine = lines[i].split(',');
			for(var j = 0; j < headings.length;j++){
				this.dataSplit[j].push(thisLine[j]);
				inputItem[headings[j]] = thisLine[j];
			}
			this.inputData.push(inputItem);
		}

		for(var i = 1;i<headings.length;i++){
			var isContinuous = true;
			for(var k =1;k<this.dataSplit[i].length;k++){
				if(isNaN(this.dataSplit[i][k])) isContinuous = false;
			}
			if(isContinuous){
				this.dataType[0].push(headings[i]);
			}else{
				this.dataType[1].push(headings[i]);
			}
		}
	}
modelBase.prototype.getFile = function(inputFile){
		var file = inputFile.target.files[0];
		var fileName = inputFile.target.value.split('\\').pop();
		this.fileName = fileName;
		d3.select("#importButton +label").text(fileName);
		var reader = new FileReader();
		reader.readAsText(file);
		this.dataSplit = {};
		reader.onload = function(e){
			var csv = e.target.result;
			this.controller.setUpDataVeiw(csv);
		}

	}
modelBase.prototype.loadFromText = function(text){
		this.controller.setUpDataVeiw(text);
	}
modelBase.prototype.loadFromURL = function(url){
		var file;
		$.ajax({
			type: 'GET',
			url: url,
			contentType: 'text/plain',
			xhrFields: { withCredentials: false},
			success: function(d){ file = d; this.controller.setUpDataVeiw(file);}
		});
	}

modelBase.prototype.setUpDataVeiw = function(csv, callback){
		var self = this;
		var parsed = d3.csv.parse(csv);
		if(parsed.length == 0){
			alert("Not valid CSV data");
			return;
		}
		this.inputData = parsed;
		this.dataHeadings = [];
		Object.keys(parsed[0]).forEach(function(d){self.dataHeadings.push([d,'n']); self.dataSplit[d] = []});
		
		this.inputData.forEach(function(row){
			self.dataHeadings.forEach(function(heading){
				self.dataSplit[heading[0]].push(row[heading[0]]);
				if(isNaN(row[heading[0]])){
					if(row[heading[0]] != "NA" && row[heading[0]] != "" && row[heading[0]] != " " && row[heading[0]] != "N\\A"){
						heading[1] = 'c';
					}
				}
			})
		})
		callback(this.dataHeadings);
	}
modelBase.prototype.loadPresetData = function(){
		this.fileName = "test data";
		this.controller.setUpDataVeiw(this.testingData);
	}
modelBase.prototype.varSelected = function(e){
		if(this.display){
			this.display.destroy();
		}
		this.display = null;
		var selected = [];
		var numeretical = [];
		var categorical = [];
		for(var i =0;i<e.length;i++){
			var d = e[i];
			var val = d.value.split(",");
			selected.push([val[0],val[1]]);
			if(val[1] == "n"){
				numeretical.push(val[0])
			}else{
				categorical.push(val[0])
			}
		}
		for(var n =0; n<this.visualisations.length;n++){
			var vis = this.visualisations[n];
			if(vis.numeretical == numeretical.length && vis.categorical == categorical.length){
				this.currentDisplayType = n;
				this.display = vis.setupParams(numeretical,categorical,this);
				this.controller.startVisPreveiw();
				this.currentCategory = vis.stats;
				//controller.setUpStatSelection(this.stats[vis.stats]);
			}
		}
		if(!this.display){
			this.controller.noVisAvail();
		}
	}
modelBase.prototype.destroy = function(){
		this.display.destroy();
	}
modelBase.prototype.switchFocus = function(newFocus){
		var curCategory = this.display.category;
		var curCategory2 = this.display.category2;
		this.display.destroy();
		if(this.currentDisplayType == 2){
			this.display = new oneProportion(this.inputData, curCategory, newFocus)
		}
		if(this.currentDisplayType == 3){
			this.display = new twoProportion(this.inputData, curCategory, curCategory2, newFocus)
		}
	}
modelBase.prototype.switchVar = function(changeTo){
		this.destroy();
		var curCategory = this.display.category;
		var curCategory2 = this.display.category2;
		if(changeTo == curCategory2){
			curCategory2 = curCategory;
		}
		var unique = this.dataSplit[curCategory2].filter(onlyUnique);
		var newFocus = unique[0];
		this.controller.makeFocusSelector(unique, curCategory2);
		if(this.currentDisplayType == 3){
			this.display = new twoProportion(this.inputData, curCategory2, changeTo, newFocus);
		}

	}