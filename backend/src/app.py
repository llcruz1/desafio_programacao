from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI']='mongodb://localhost/desafio'
mongo = PyMongo(app)

CORS(app)

db = mongo.db.celulares

@app.route('/celulares', methods = ['POST'])
def createCelular():
    print(request.json)
    id = db.insert_one({
        'marca': request.json['marca'],
        'modelo': request.json['modelo'],
        'memoria': request.json['memoria'],
        'lancamento': request.json['lancamento']
    })
    
    return jsonify(str(ObjectId(id)))


@app.route('/celulares', methods = ['GET'])
def getCelulares():
    celulares = []
    for celular in db.find():
        celulares.append({
            '_id': str(ObjectId(celular['_id'])),
            'marca': celular['marca'],
            'modelo': celular['modelo'],
            'memoria': celular['memoria'],
            'lancamento': celular['lancamento'],
        })
    print(celulares)
    return jsonify(celulares)

@app.route('/celular/<id>', methods = ['GET'])
def getCelular(id):
    celular = db.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(ObjectId(celular['_id'])),
        'marca': celular['marca'],
        'modelo': celular['modelo'],
        'memoria': celular['memoria'],
        'lancamento': celular['lancamento']
    })

@app.route('/celulares/<id>', methods = ['DELETE'])
def deleteCelular(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Celular deletado.'})

@app.route('/celulares/<id>', methods = ['PUT'])
def updateCelular(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'marca': request.json['marca'],
        'modelo': request.json['modelo'],
        'memoria': request.json['memoria'],
        'lancamento': request.json['lancamento']
    }})
    return jsonify({'msg': 'Celular alterado'})

if __name__ == "__main__":
    app.run(debug=True)
