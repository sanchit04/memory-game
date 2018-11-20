/*
 * Create a list that holds all of your cards
 */
const list_of_cards = [
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb',
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb'
];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
$(function() {

    let selectedCardName = "";
    let attempt_ct = 0; // Maximum is 2
    let moves_ct = 0;
    let timer_ct = 60; // 60 seconds
    let correct_move = 0;
    let $deck = $(".deck");
    let $moves = $('.moves');
    let $timer = $('.timer');
    let $restart = $('.restart');
    let $stars = $('.stars');
    let $icon = $('.icon');
    let $sub_title = $('.sub-title');
    let $sub_text = $('.sub-text');
    let $sub_text_2 = $('.sub-text-2');

    // Shuffling cards (Randomization)
    let list_of_cards_shuffled = shuffle(list_of_cards);

    // Rendering shuffled cards
    for ( card_idx in list_of_cards_shuffled ) {
        /*console.log(list_of_cards_shuffled[card_idx]);*/
        let cardEl = "<li class=\"card\">";
        cardEl += "<i class=\"fa fa-" + list_of_cards_shuffled[card_idx] + "\"></i>"
        cardEl += "</li>";
        $deck.append(cardEl);
    }

    // Countdown timer
    let clock_timer = setInterval(() => {
        $timer.text(timer_ct);
        if (timer_ct > 0) {
            timer_ct--;
        } else if (timer_ct == 0) {
            $('.game').hide();
            $('.congratulations').fadeIn('fast');
            $icon.addClass('fa').addClass('fa-times');
            $sub_title.text("Times up!");
            $sub_text_2.text("Better luck next time.");
        }
    }, 1000);

    // Restart button click event handler
    $restart.click((e) => {
        moves_ct = 0;
        timer_ct = 60; // Reset time
        $('.match').removeClass('match');

        var starsStr = "<li>";
        starsStr += "<i class=\"fa fa-star\"></i>"
        starsStr += "</li>";
        $stars.html("");
        $stars.html(starsStr.repeat(3));
        $moves.html(moves_ct);

    });

    // Play again button click event handler
    // Page reload
    $('.again-btn').click((e) => {
        e.preventDefault();
        location.reload();
    });

    // Card click event handler
    $('.card').click((e) => {
        e.stopPropagation();

        // Show/Open the card
        let $targetEl = $(e.target);
        let isCardAlreadyOpen = $targetEl.attr('class').includes('show');

        console.log(isCardAlreadyOpen);

        // If card has NOT yet been selected
        // AND assure only two cards can be selected per move
        if (!isCardAlreadyOpen && attempt_ct < 2) {

            $targetEl.addClass('show').addClass('open').hide().fadeIn('show');

            let $selectedCard = $(e.target.children);
            let currentCardName = $selectedCard.attr('class').substring(6, $selectedCard.attr('class').length);

            attempt_ct++;

            if (attempt_ct === 2) {

                if (currentCardName !== selectedCardName) { // This is NOT a match
                    setTimeout(() => {
                        $('.show').removeClass('show').removeClass('open');
                        attempt_ct = 0; //Reset attempt counter
                    }, 1000);

                    moves_ct++;
                    $moves.html(moves_ct);
                } else { // This is a match

                    $('.show').addClass('match').removeClass('show').removeClass('open');
                    attempt_ct = 0; //Reset attempt counter
                    moves_ct++;
                    correct_move++;
                    $moves.html(moves_ct);

                    // IF player guess all cards
                    if (correct_move == list_of_cards.length / 2) {
                        $('.game').hide();
                        $('.congratulations').fadeIn('fast');
                        $icon.addClass('fa').addClass('fa-check');
                        $sub_title.text("Congratulations! You Won!");
                        $sub_text.text("With " + moves_ct + " Moves and " + $stars.children().length + " Stars in " + timer_ct + " seconds!" );
                        $sub_text_2.text("Woohoo!");

                        // Stop timer
                        clearInterval(clock_timer);
                    }

                    // Star ratings
                    // Ensure there are stars available before removing it
                    if ($stars.children().length > 0) {
                        if (moves_ct == 16) {
                            $stars.children()[0].remove();
                        } else if (moves_ct == 24) {
                            $stars.children()[0].remove();
                        }
                    }

                }

            }

            // Update selectedCardName with the current selectedCardName
            selectedCardName = currentCardName;

        }

    }).children().click(function(e) {
        return false;
    });

});