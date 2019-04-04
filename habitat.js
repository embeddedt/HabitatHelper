
var currentCategory = "plant";

var chosenAnimal = "polarbear.png";

var animalClimate;

var animalDiet;

var perfect;

var numSquares = 4;

var chosenFence = undefined;

var lastBackground = "tomato";
var backgroundAlt = undefined;

var correctString = "<span style='color: #00bb00'> &#10003; This is an appropriate choice for these animals.</span>";

var correctPrefix = "<span style='color: #00bb00'> &#10003; ";
var incorrectPrefix = "<span style='color: #bb0000'> &#10060; ";

$(window).resize(function() {
    var w = $(".habitat-builder-flex").width() * 0.11;
    //$(".habitat-builder-choice:not('.habitat-builder-choice-fullsize')").css({ width: w, height: w});
    $(".overflow-hider").css({ width: w, height: w});
    $(".hbch").css({ height: w });
    $(".l-to-r-container")[0].scrollIntoView({ behavior: "auto", block: "start", inline: "center" });
});

function getFilename(filepath) {
    return filepath.substring(4, filepath.length - 1);
}

function hasCategory(str, cat) {
    var splitString = str.split(',');
    var found = false;
    for (var i = 0; i < splitString.length; i++) {
        var stringPart = splitString[i];
        if (stringPart !== cat) continue;

        found = true;
        break;
    }
    return found;
}
function makeItemsDraggable() {

}

function acknowledgedStats() {
    $("#statsDialog").dialog('close');
    if(perfect) {
        $("#endDialog").dialog({ modal: true});
    }
} 

function buildIt() {
    var numPlants = 0;
    var numEmptySquares = 0;
    var totalSquares = numSquares * numSquares;
    var numMeat = 0;
    var numHerb = 0;
    var tundraOk = true;
    perfect = true;
    var children=$('.habitat-builder-flex').children();
    
    var climateStr = correctString;
    var plantStr = correctString;
    var foodStr = correctString;
    var habitatStr = correctPrefix + "Great job! You've built an awesome habitat for this animal!</span>";
    
    /* Walk through all the squares and find out what's where*/
    for(var i = 0; i < children.length; i++) {
        var contents = $(children[i]).children()[0];
        if(contents === undefined) {
            numEmptySquares++;
            continue;
        } else {
            console.log("Found: " + contents.className);
            if(hasCategory($(contents).attr("data-category"), "plant")) {
                if($(contents).attr('data-tundraok') !== "1")
                    tundraOk = false;
                numPlants++;
            }
            
            if(hasCategory($(contents).attr("data-category"), "food")) {
                if(hasCategory($(contents).attr("data-category"), "plant"))
                    numHerb++;
                else if(hasCategory($(contents).attr("data-category"), "meat"))
                    numMeat++;
            }
        }
    }
    console.log("There are " + numPlants + " plants on the map.");
    console.log("There are " + numMeat + " meat-based food products on the map.");
    console.log("There are " + numHerb + " plant-based food products on the map.");
    
    if(backgroundAlt !== animalClimate) {
        console.log("lastBackground " + backgroundAlt + " animalClimate " + animalClimate);
        
        climateStr = incorrectPrefix + "This animal won't thrive in that climate.</span>";
        console.log("climateStr " + climateStr);
        perfect = false;
    }
    
    if(numPlants < 5) {
        plantStr = incorrectPrefix + "There aren't enough plants here.</span>";
        perfect = false;
    } else if(backgroundAlt === "tundra" && !tundraOk) {
        plantStr = incorrectPrefix + "Since when are these types of plants seen in the tundra?</span>";
        perfect = false;
    }
    
    if(animalDiet === "herbivore")
        numMeat = Math.max(numSquares / 8, 4); /*Ignore meat value*/
    
    else if(animalDiet === "carnivore")
        numHerb = Math.max(numSquares / 8, 4); /*Ignore plant value*/
    console.log("numHerb " + numHerb + "numMeat " + numMeat + " animalDiet " + animalDiet + " numSquares " + numSquares);
    if(numMeat < Math.max(numSquares / 8, 4) || numHerb < Math.max(numSquares / 8, 4)) {
        foodStr = incorrectPrefix + "The animals will quickly run out of food. Make sure you choose the appropriate type of food.</span>";
        perfect = false;
    } else {
    }
    
    if(numEmptySquares > numSquares*(numSquares/2)) {
        habitatStr = incorrectPrefix + "This place seems a little... dead. Could you add some more wildlife?</span>";
        perfect = false;
    } else if((numEmptySquares/totalSquares) < 0.1) {
        habitatStr = incorrectPrefix + "Maybe you have too many items in your habitat. This place seems crowded.</span>";
        perfect = false;
    } else if(!perfect)
        habitatStr = incorrectPrefix + "You could make some improvements. Have a look at the suggestions above.</span>";
    
    
    
    $("#climateStr").html(climateStr);
    $("#plantStr").html(plantStr);
    $("#foodStr").html(foodStr);
    $("#habitatStr").html(habitatStr);
    $("#statsDialog").dialog({ modal: true});
}

function generateHabitatBuilder(element) {
    
    var percentage = ((1 / numSquares) * 100) + "%";
    console.log(percentage);
    var animalCount = 0;
    do {
        $(element).empty();
        animalCount = 0;
        for(var i = 0; i < numSquares*numSquares; i++) {
            var child = document.createElement("div");
            child.classList.add("habitat-builder-square");
            $(child).attr("data-index", i);
            $(child).css('background', lastBackground);
            element.appendChild(child);
            if(Math.random() <= 0.1) {
                var img = document.createElement("img");
                img.src = chosenAnimal;
                $(img).attr("data-category", "animal");
                img.classList.add("habitat-builder-image");
                img.classList.add("habitat-builder-animal");
                child.appendChild(img);
                animalCount++;
            }
        }
    } while(animalCount < (numSquares*numSquares)/4);
    $(".habitat-builder-square").css({ 
        'flex-basis': percentage,
        '-webkit-flex-basis': percentage
    });
    $(".habitat-builder-choice-fullsize, .habitat-builder-choice").click(function() {
        $("#tooltip").text($(this).attr("alt"));
        if($(this).hasClass("habitat-builder-choice-fullsize")) {
            if($(this).attr("data-category") === "fence") {
                
                $("#fence").css("background", 'url(' + $(this).attr("src") + ') 50% 50% no-repeat');
                chosenFence = $(this).attr("alt");
            } else {
                $(".habitat-builder-square").css({ 'background-image': 'url(' + $(this).attr("src") + ')'});
                lastBackground = 'url(' + $(this).attr("src") + ')';
                backgroundAlt = $(this).attr("alt");
            }
        }
    });
    $(".habitat-builder-choice:not('.habitat-builder-choice-fullsize')").draggable({
        revert: "invalid",
        helper: "clone",
        start: function() {
            $("#tooltip").text($(this).attr("alt"));
        }});
    $(".habitat-builder-square").droppable( {
        accept: function(d) {
            if($(d).attr("src") === "delete.svg") {
                if($(this).children().hasClass("habitat-builder-animal"))
                    return false;
                else
                    return true;
            } else if((d.hasClass("habitat-builder-choice")&&$(this).children().length === 0))
                return true;
            else
                return false;
        },
        drop: function(event, ui) {
            var item = $(ui.draggable)[0];
            var src = $(item).attr("src");
            if($(item).hasClass("habitat-builder-choice")) {
                var category = $(item).attr("data-category");
                if(src === "delete.svg") {
                    console.log("Delete");
                    $(this).empty();
                } else if(hasCategory(category, "land")) {
                    console.log("Change background");
                    
                } else if($(this).children().length === 0) {
                    var img = document.createElement("img");
                    img.src = $(item).attr("src");
                    $(img).attr("data-category", category);
                    $(img).attr("data-tundraok", $(item).attr("data-tundraok"));
                    img.classList.add("habitat-builder-image");
                    img.classList.add("habitat-builder-item");
                    $(this)[0].appendChild(img);
                }
            } else {
                $(item).detach().appendTo($(this));
            }
            ui.helper.data('dropped', true);
            makeItemsDraggable();
        }
    });
    makeItemsDraggable();
}

var dialogs = [ "startDialog", "landDialog" ];
var dialogId = 0;
function nextDialog() {
    var isOk = true;
    dialogId--;
    if(dialogId === 0) {
        chosenAnimal = $('option[value="'+$("#animal-selector").val()+'"]').attr("data-img-src");
        animalClimate = $('option[value="'+$("#animal-selector").val()+'"]').attr("data-climate");
        animalDiet = $('option[value="'+$("#animal-selector").val()+'"]').attr("data-diet");
        
    } else if(dialogId === 1) {
        $(".habitat-builder-square").css({ 'background-image': 'url(' + $('option[value="'+$("#land-selector").val()+'"]').attr("data-img-src") + ')'});
        lastBackground = 'url(' + $('option[value="'+$("#land-selector").val()+'"]').attr("data-img-src") + ')';
        backgroundAlt = $('option[value="'+$("#land-selector").val()+'"]').attr("data-climate");
        if(backgroundAlt !== animalClimate) {
            var str = incorrectPrefix + "This animal won't thrive in that climate.</span>";
            isOk = false;
        }
        generateHabitatBuilder($(".habitat-builder-flex")[0]);
    }
    dialogId++;
    if(isOk) {
        try { $("#" + dialogs[dialogId-1]).dialog('close'); } catch(e) {}
    } else {
        $("#incorrect-info").html(str);
        $("#incorrectDialog").dialog({
            modal: true
        });
        return;
    }
    $("#" + dialogs[dialogId]).dialog({ 
        modal: true,
        width: 'auto',
        height: 'auto',
        resizable: false,
        minHeight: 0,
        open : function(event, ui) {
            $(".anchor-for-scrolling").focus();
        },
        create: function() {
            $(".ui-dialog-content").css("max-height", "200px");
            $(".habitat-info-div").scrollTop(0);
            try { $(".anchor-for-scrolling")[0].scrollIntoView(); } catch(e) {}
        }
    });
    dialogId++;
}

function startGame() {
    
    
    try { $("#endDialog").dialog('close'); } catch(e) {}
    
}
$(function() {
    generateHabitatBuilder($(".habitat-builder-flex")[0]);
    $( ".fraction-part" ).spinner({ min: 2, max: 9, step: 1 });
    $('.ui-spinner a.ui-spinner-button').css('display','none');
    $( ".fraction-part").bind('focusout keyup', function(event) {
        console.log("Change");
 
        numSquares = parseInt($("#habitat-size").val());
        
        if(numSquares < 2)
            numSquares = 2;
        else if(numSquares > 9)
            numSquares = 9;
        
        $("#habitat-size").val(numSquares);
        generateHabitatBuilder($(".habitat-builder-flex")[0]);
    });
    $(window).resize();
    $("#animal-selector").imagepicker({
        hide_select : true,
        show_label  : true
    });
    $("#land-selector").imagepicker({
        hide_select : true,
        show_label  : true
    });
    nextDialog();
});