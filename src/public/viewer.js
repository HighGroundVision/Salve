const twitch = window.Twitch.ext;


twitch.onContext(function(context) {
    // twitch.rig.log(context);
});

const API_URL = "https://eaglesong.azurewebsites.net/api"

twitch.configuration.onChanged(async function() {
    if (twitch.configuration.broadcaster) {
        try {
            var config = JSON.parse(twitch.configuration.broadcaster.content);
            var response = await $.get(`${API_URL}/details/${config.account}`);

            var app = $("#app");
            app.empty();

            var summary = $("<div>")
                .css("background-color", "#291764")
                .css("display", "flex");

            var part1 = $("<div>")
                .css("padding", "5px")
                .css("display", "flex");
            var avatar = $("<img />", {
                id: "avatar",
                src: response.summary.avatar,
                width: 32,
                height: 32
            });
            part1.append(avatar);
            var name = $("<div>");
            name.click(function() {
                window.open("https://windrun.io/players/" + response.summary.account_id);
            });
            var persona = $("<div>")
                .css("font-size", "1.3em")
                .css("padding", "1px")
                .text(response.summary.persona.length > 15 ? response.summary.persona.slice(0, 15) : response.summary.persona);
            name.append(persona);
            var region = $("<div>")
                .css("font-size", "0.6em")
                .css("padding", "1px")
                .text("REGION " + response.summary.region.toUpperCase());
            name.append(region);
            part1.append(name);
            summary.append(part1);

            summary.append($("<div>").css("flex", "1"));

            var part2 = $("<div>")
                .css("padding", "5px")
                .css("display", "flex")
                .css("flex-direction", "column")
                .css("text-align", "center");
            var matches = $("<div>")
                .text("MATCHES")
                .css("font-size", "0.6em");
            var record = $("<div>");
            var wins = $("<span>")
                .css("font-size", "1.3em")
                .css("color", "#76d976")
                .text(response.summary.wins);
            var losses = $("<span>")
                .css("font-size", "1.3em")
                .css("color", "#ca5050")
                .text(response.summary.losses);
            record.append(wins).append(" - ").append(losses);
            var winrate = $("<div>")
                .text(Math.round(response.summary.win_rate * 100) + "%")
                .css("font-size", "0.9em");
            part2.append(matches);
            part2.append(record);
            part2.append(winrate);
            summary.append(part2);

            var part3 = $("<div>")
                .css("padding", "5px")
                .css("display", "flex")
                .css("flex-direction", "column")
                .css("text-align", "center");
            var ranking = $("<div>")
                .text("RATING")
                .css("font-size", "0.6em");
            var rating = $("<div>")
                .css("font-size", "1.2em")
                .css("padding", "2px")
                .css("border-radius", "3px")
                .css("color", "#ffcc33")
                .css("background", "linear-gradient(to bottom,rgba(140,93,69,1) 0%,rgba(61,30,24,1) 100%)")
                .text(Math.round(response.summary.rating));


            var rank = $("<div>")
                .css("font-size", "0.9em")
                .text("#" + response.summary.regional_rank);

            part3.append(ranking);
            part3.append(rating);

            if (response.summary.regional_rank) {
                part3.append(rank);
            }

            summary.append(part3);

            app.append(summary);

            var history = $("<div>")
                .css("display", "flex")
                .css("flex-direction", "column-reverse");

            for (const match of response.history) {
                var row = $("<div>")
                    .css("display", "flex")
                    .css("flex-direction", "row")
                    .css("padding-top", "5px")
                    .css("padding-bottom", "5px")
                    .data("match", match.match_id);

                var victory = $("<div>")
                    .css("background", match.victory ? "#76d976" : "#ca5050")
                    .css("border-radius", "3px")
                    .css("color", "black")
                    .css("text-align", "center")
                    .css("font-weight", "bold")
                    .css("line-height", "24px")
                    .css("width", "24px")
                    .css("height", "24px")
                    .css("font-size", "1.5em")
                    .text(match.victory ? "W" : "L");
                row.append(victory);

                var hero = $("<img />", {
                        src: "https://hyperstone.highgroundvision.com/images/heroes/icon/" + match.hero + ".png",
                        width: 24,
                        height: 24
                    })
                    .css("margin-left", "5px")
                    .css("margin-right", "5px");
                row.append(hero);

                for (const ability of match.abilities) {
                    var item = $("<img />", {
                            src: "https://hyperstone.highgroundvision.com/images/abilities/" + ability + ".jpg",
                            width: 24,
                            height: 24
                        })
                        .css("border-radius", "5px")
                        .css("margin-left", "5px")
                        .css("margin-right", "5px");

                    row.append(item);
                }

                row.append($("<div>").css("flex", "1"));

                var kda = $("<div>")
                    .css("text-align", "center")
                    .css("vertical-align", "baseline")
                    .css("line-height", "24px")
                    .text(match.kills + " / " + match.deaths + " / " + match.assists);
                row.append(kda);

                row.append($("<div>").css("flex", "1"));

                var time = $("<div>")
                    .text(match.when < 1 ? "1d" : match.when + "d")
                    .css("text-align", "center")
                    .css("vertical-align", "baseline")
                    .css("line-height", "24px")
                row.append(time);

                row.click(function() {
                    var matchId = $(this).data("match");
                    window.open("https://windrun.io/matches/" + matchId);
                });

                history.append(row);
            }

            app.append(history);
        } catch (error) {
            // Just leave it blank..
        }
    }
});

$(function() {

});