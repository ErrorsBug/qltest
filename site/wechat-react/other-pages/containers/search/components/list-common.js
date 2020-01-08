const count = 14;

const elliHandler = (mes, bol)=>{
    if(/\<em\>/.test(mes)){
        let arr = mes.match(/\<em\>/g);
        let emlength =  arr.length * 9;
        let start = mes.indexOf('<em>');
        let end = mes.lastIndexOf('</em>') + 5;
        let fontCount = end - start - emlength;
        if(bol){
            if(mes.length - emlength > 9){
                if(fontCount < 9){
                    if(end - emlength > 9){
                        mes = mes.substring(start - (9 - fontCount),end);
                    }
                }else {
                    mes = mes.substring(start,mes.length-1)
                }
            }
        }else {
            if(mes.length - emlength > 2 * count){
                if(fontCount < 2 * count){
                    if(end - emlength > 2 * count){
                        mes = mes.substring(start - (2 * count - fontCount),end);
                    }
                }else {
                    mes = mes.substring(start,mes.length-1)
                }
            }
        }
    }
    return mes;
}
export default elliHandler;