
class DocItem {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}


export default {
    Query: {
        getList({ req, res }, params) {
            const Item = new DocItem('123', 111);

            return [Item]
        }
    }
}
