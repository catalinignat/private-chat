var Connection = function () {
    this.socket;
    this.connect = function () {
        //this.socket = io.connect("http://demo-project-catalinignat.c9.io:80");
        this.socket = io.connect("localhost:3000");

    }

}