import g4f
import json
import random
import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

system_prompt = '你是一个面向对象程序设计的大师。对于以 JSON 格式给出的单项选择题，你总能给出正确的答案。对于接下来给出的题目，你的回答需要给出答案选项大写字母和中文解析，以 JSON 格式给出。例如，某道题目的正确答案是 A 选项，那么你需要回答：“{"答案": "A", "解析": "C++ 是面向对象的程序设计语言。"}”。再次强调，即使题目和选项是用英文给出的，你也要输出中文的解析。'

@app.route('/g4f', methods = ['POST'])
def handleChat():
    if request.headers.get('origin') != 'https://pintia.cn':
        return '403 Forbidden', 403
    
    proxy_json = random.choice(proxy_list)
    proxy = 'http://' + proxy_json['ip'] + ':' + str(proxy_json['port'])
    print(proxy)

    problem = request.get_json().get('problem')
    options = request.get_json().get('options')
    response = g4f.ChatCompletion.create(
        model = g4f.models.gpt_4,
        proxy = proxy,
        provider = g4f.Provider.Bing,
        messages = [{'role': 'system', 'content': system_prompt}, {'role': 'user', 'content': json.dumps({
            '问题': problem, '选项': options
        }, ensure_ascii = False).replace('\\n', '\n')}],
    )
    return response.replace('\\', '')

if __name__ == '__main__':
    proxy_list = requests.get('http://api.proxy.ip2world.com/getProxyIp?regions=us&lb=1&return_type=json&protocol=http&num=500').json()['data']

    app.run(host = '127.0.0.1', port = 8008, debug = False)