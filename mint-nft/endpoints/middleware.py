from flask import Flask, request
import datetime
import subprocess
import json
from flask_cors import CORS

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app)
 
# E.g "http://localhost:5000/mint?location=woodlands&price=10&kwh=32"
# Route to mint
@app.route('/mint')
def mint():
 
    # Returning an api for showing in reactjs
    location = request.args.get('location')
    kwh = request.args.get('kwh')
    price = request.args.get('price')

    data = {
        'location': location,
        'kwh': kwh,
        'price': price
    }
    try:
        with open('../parameters/mint_parameters.json', 'w') as file:
            # Write data to the file
            json.dump(data, file)

        result = subprocess.run(['ts-node', '../app/mint-ret.ts'], capture_output=True, text=True)

        # Check the command's output
        if result.returncode == 0:
            # Command executed successfully
            output = result.stdout
            print(output)
            return '200 ok'
        else:
            # Command encountered an error
            error = result.stderr
            print(f"Command failed with error: {error}")
            return 'not ok at command minting'
    except:
        return '400 not ok'

#E.g http://localhost:5000/sendToken?mintaddress=HszY46k3rFDKAs5NimNSDjuos8yF8mE6nE2aDfmezNNc&walletaddress=4g7fBAWCGATnyZBeHacN3UrZ1ujLF1SRayR7gjtzJaa9
@app.route('/sendToken')
def sendToken():
 
    # Returning an api for showing in reactjs
    wallet_address = request.args.get('walletaddress')
    mint_address = request.args.get('mintaddress')
    print(f"wallet_address: {wallet_address}")
    print(f"mint_address: {mint_address}")

    data = {
        "mint_address": mint_address,
        "receiver" : wallet_address
    }
    try:
        with open('../parameters/sendToken_parameters.json', 'w') as file:
            # Write data to the file
            json.dump(data, file)

        result = subprocess.run(['ts-node', '../app/sendtoken.ts'], capture_output=True, text=True)

        # Check the command's output
        if result.returncode == 0:
            # Command executed successfully
            output = result.stdout
            print(output)
            return '200 ok'
        else:
            # Command encountered an error
            error = result.stderr
            print(f"Command failed with error: {error}")
            return "not ok at command sending token\n"
    except:
        return '400 not ok\n'

#E.g http://localhost:5000/sendSol?price=3
@app.route('/sendSol')
def sendSol():
 
    # Returning an api for showing in reactjs
    price = request.args.get('price')

    data = {
        "price": price
    }
    try:
        with open('../parameters/sendSol_parameters.json', 'w') as file:
            # Write data to the file
            json.dump(data, file)

        result = subprocess.run(['ts-node', '../app/sendsol.ts'], capture_output=True, text=True)

        # Check the command's output
        if result.returncode == 0:
            # Command executed successfully
            output = result.stdout
            print(output)
            return '200 ok'
        else:
            # Command encountered an error
            error = result.stderr
            print(f"Command failed with error: {error}")
            return 'not ok at command sending sol'
    except:
        return '400 not ok'
     
#E.g http://localhost:5000/getAccounts
@app.route('/getAccounts')
def getAccounts():
 


    try:
        result = subprocess.run(['ts-node', '../app/getTokenAccounts.ts'], capture_output=True, text=True)

        with open('../parameters/accounts.json', 'w') as file:
            # Write data to the file
            json.dump(result.stdout, file)


        # Check the command's output
        if result.returncode == 0:
            # Command executed successfully
            output = result.stdout
            return output
        else:
            # Command encountered an error
            error = result.stderr
            print(f"Command failed with error: {error}")
            return 'not ok at command getting accounts'
    except:
        return '400 not ok'

# Running app
if __name__ == '__main__':
    app.run(debug=True)