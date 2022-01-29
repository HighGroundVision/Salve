let  config, theme;

const twitch = window.Twitch.ext;

twitch.onContext((context) => {
    theme = context.theme;
    if (theme == "dark") {
        $("body").css("color", "white").css("background", "black");
    } else {
        $("body").css("color", "black").css("background", "white");
    }
});

twitch.configuration.onChanged(function() {
    if (twitch.configuration.broadcaster && twitch.configuration.broadcaster.content) {
        config = JSON.parse(twitch.configuration.broadcaster.content);
        $("#accountid").val(config.account);
    }
});

twitch.onError(function(err) {
    // twitch.rig.log("Error", err);
});

const API_URL = "https://eaglesong.azurewebsites.net/api"

$(function() {
    $('#check').click(async function() {
        try {
            var identity = $("#identity").val();
            var slug = encodeURIComponent(identity);

            $("#check-error").text("").hide();
            $("#identity").val("");
            
            var data = await $.get(`${API_URL}/check/${slug}`);

            $("#accountid").val(data.account_id);
        } catch (error) {
            $("#check-error").text("Could not find an Account Id for the identity entered.").show();
        }
    });

    $('#save').click(async function() {
        try {
            $("#account-error").text("").hide();
            var accountid = $("#accountid").val();

            await $.get(`${API_URL}/profile/${accountid}`);

            var context = { account: accountid };
            twitch.configuration.set("broadcaster", "1.0.0", JSON.stringify(context));
        } catch (error) {
            $("#accountid").val("");
            $("#account-error").text("Not able to find Account Id that matches the value entered.").show();
        }
    });
});