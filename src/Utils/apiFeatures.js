class ApiFeatures {

    constructor(MongooseQuery, QueryString) {

        this.MongooseQuery = MongooseQuery;
        this.QueryString = QueryString;

    };



    pagination() {


        // 1- Pagination

        let page = (this.QueryString.page * 1 > 0 ? this.QueryString.page * 1 : 1) || 1;
        let limit = 5;
        let skip = (page - 1) * limit;

        this.MongooseQuery.skip(skip).limit(limit);
        this.page = page;

        return this;

    };



    Filter() {


        // 2- Filter

        let Query = { ...this.QueryString };
        let Query_Not_Use = ["page", "sort", "keyword", "fields"];

        Query_Not_Use.forEach((ele) => {

            delete Query[ele];

        });


        Query = JSON.stringify(Query);
        Query = Query.replace(/(gte|gt|lte|lt)/g, (match) => `$${match}`);
        Query = JSON.parse(Query);

        this.MongooseQuery.find(Query);

        return this;

    };



    Sort() {

        // 3- Sort

        if (this.QueryString.sort) {

            let Value_Of_Sort = (this.QueryString.sort).split(",").join(" ");
            this.MongooseQuery.sort(Value_Of_Sort);

        };

        return this;

    };




    Fields() {

        // 4- Fields

        if (this.QueryString.fields) {

            let Value_Of_Fields = (this.QueryString.fields).split(",").join(" ");
            this.MongooseQuery.select(Value_Of_Fields);

        };

        return this;

    };




    Search() {

        // 5- Search

        if (this.QueryString.keyword) {

            this.MongooseQuery.find({ $or: [{ name: { $regex: this.QueryString.keyword, $options: "i" } }, { description: { $regex: this.QueryString.keyword, $options: "i" } }] });

        };

        return this;

    };


};


export default ApiFeatures;