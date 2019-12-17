
class Condition{
    
    constructor(data){
        if(!data){
            this.type = 0;
            this.data = data;
        }else{
            this.type = data["type"] || 0;
            this.data = data;
        }
    }

}

module.exports = {Condition};