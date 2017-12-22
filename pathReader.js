var path = require("path");




function PathReader(){
    this.readHTMLFile = function(filename,response){
        response.sendFile(
            path.join(__dirname+"/public_html",filename+".html")
        );
    }
}

module.exports = new PathReader();