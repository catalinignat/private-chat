application.app.directive("chat", function () {
    return {
        templateUrl: "templates/chat.html",
        controller: function ($scope) {
            var nickName = "Anonim",
                element = document.getElementsByTagName("chat")[0],
                DataToSendServer = {}

            initialize();

            function initialize() {
                if (!localStorage.getItem("nickName")) {
                    $("#chat-auth").css("visibility", "visible");
                    $("#chat-container").css("visibility", "hidden");
                } else {
                    nickName = localStorage.getItem("nickName");
                    $("#chat-auth").css("visibility", "hidden");
                    $("#chat-container").css("visibility", "visible");
                }

                $scope.clickAuth = function () {
                    nickName = document.getElementById("chat-user").value;
                    if (!localStorage.getItem("nickName")) {
                        localStorage.setItem("nickName", nickName);
                    }

                    $("#chat-auth").css("visibility", "hidden");
                    $("#chat-container").css("visibility", "visible");
                    element.scrollTop = element.scrollHeight;

                    DataToSendServer.nick = nickName;
                }
                $scope.onKeyPressHandler = function ($event) {
                    element.scrollTop = element.scrollHeight + 50;
                    var enterKey = 13;
                    if ($event.charCode === enterKey) {
                        sendNewMsg();
                    }
                }

                DataToSendServer.nick = nickName;

                application.connection.socket.emit("user", DataToSendServer);
                application.connection.socket.on("user", function (data) {
                    $scope.usernames = data[0];
                    $scope.messages = data[1];
                    $scope.$apply();
                });
            }

            $scope.clickSendMess = function () {
                sendNewMsg();
            }

            function sendNewMsg() {
                var inputText = document.getElementById("chat-input"),
                    text = inputText.value;
                DataToSendServer.msg = text;

                if (inputText.value.length > 0) {
                    application.connection.socket.emit("new message", DataToSendServer.msg);
                }
                inputText.value = "";
            }

            application.connection.socket.on("new message", function (data) {
                console.log(data);
                $("#chat-screen").remove();
                $("#chat-container").append("<div class='chat' id='chat-screen'></div>");
                var numItem = data.msgs.length;

                for (var i = 0; i < numItem; i += 1) {
                    $("#chat-screen").append("<b>" + data.userNames + ":</b> " + data.msgs[i] + "<br/>");
                }
                element.scrollTop = element.scrollHeight + 50;


            });
            application.connection.socket.on("send notification", function (msg) {
                notifyMe(msg[msg.length - 1]);
            });


            // request permission on page load
            document.addEventListener('DOMContentLoaded', function () {
                if (Notification.permission !== "granted")
                    Notification.requestPermission();
            });

            function notifyMe(msg) {
                if (!Notification) {
                    alert('Desktop notifications not available in your browser. Try Chromium.');
                    return;
                }

                if (Notification.permission !== "granted")
                    Notification.requestPermission();
                else {
                    var notification;
                    if (notification) {
                        notification.close();
                    }
                    notification = new Notification('Notification title', {
                        icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                        body: msg,
                    });
                    setTimeout(function () {
                        notification.close();

                    }, 3000);

                    notification.onclick = function () {
                        window.open("http://catalinignat.ro/share-location/");
                    };

                }

            }


            application.connection.socket.on("check user exist", function (isExist) {
                console.log(isExist);

            });
        }
    }
});

application.app.directive("map", function () {
    return {
        templateUrl: "templates/map.html",
        controller: function ($scope) {

            var myLatLng = {
                lat: 44.445558,
                lng: 26.038046
            };
            setTimeout(function () {
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    center: myLatLng
                });

                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: 'Hello World!'
                });
            }, 1000);
        }
    }
})