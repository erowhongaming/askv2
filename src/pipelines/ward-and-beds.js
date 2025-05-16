const { ObjectId } = require('mongodb');

const wardspipeline = () => {
  return [
        {
            '$match': {
                'warduid': new ObjectId("5f94507b79b68ea9ffb3f74f")
            }
        },
        {
            '$project': {
                'name': 1,
            }
        }
    ];
};

module.exports = wardspipeline;
