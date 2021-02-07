let token, userId, config, theme;

const twitch = window.Twitch.ext;

twitch.onContext((context) => {
    theme = context.theme;
    if (theme == "dark") {
        $("body").css("color", "white").css("background", "black");
    } else {
        $("body").css("color", "black").css("background", "white");
    }
});

twitch.onAuthorized((auth) => {
    token = auth.token;
    userId = auth.userId;
    $('#save').removeAttr('disabled');
});

twitch.configuration.onChanged(function() {
    //twitch.rig.log("global", twitch.configuration.global);
    //twitch.rig.log("broadcaster", twitch.configuration.broadcaster);
    //twitch.rig.log("developer", twitch.configuration.developer);

    if (twitch.configuration.broadcaster && twitch.configuration.broadcaster.content) {
        config = JSON.parse(twitch.configuration.broadcaster.content);
        $("#accountid").val(config.account);
        UpdateUser(config.account);
    }
});

twitch.onError(function(err) {
    // twitch.rig.log("Error", err);
});

async function UpdateUser(account) {
    var response = await $.get(`https://eaglesong.azurewebsites.net/api/profile/${account}`);
    $("#avatar").attr("src", response.avatar);
    $("#persona").text(response.persona);
}

$(function() {
    $('#save').click(function() {
        var accountid = $("#accountid").val();
        UpdateUser(accountid);
        var context = { account: accountid };
        twitch.configuration.set("broadcaster", "0.0.1", JSON.stringify(context));
    });
});