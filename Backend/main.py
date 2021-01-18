import json
from datetime import datetime
import os, ast
from time import time

from flask import Flask, render_template, request, send_from_directory, session
from flask_session import Session
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

import converter  # converter.py
from loggers import log, log_this, log_visit
from trimmer import trimmer  # Importing the blueprint in trimmer.py
from yt import yt  # Importing the blueprint in yt.py

app = Flask(__name__)
secret_key = str(os.urandom(16))
app.secret_key = secret_key
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
# Set the maximum upload size to 3 GB.
max_upload_size = 3  # in GB.
app.config['MAX_CONTENT_LENGTH'] = max_upload_size * 1000 * 1000 * 1000
# Changes to the HTML files are reflected on the website without having to restart the Flask app.
app.jinja_env.auto_reload = True

app.register_blueprint(yt)
app.register_blueprint(trimmer)

# The database object (db) needs to be defined in main.py even though we're not using the database in main.py
# Otherwise you get the following error:
# 'AssertionError: The sqlalchemy extension was not registered to the current application.'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# For the chat section of the website.
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins='*')

SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

os.makedirs('uploads', exist_ok=True)
os.makedirs('conversions', exist_ok=True)


def run_converter(codec, params):
    codec_to_converter = {
                            'aac': converter.aac,
                            'ac3': converter.ac3,
                            'alac': converter.alac,
                            'dts': converter.dts,
                            'flac': converter.flac,
                            'mka': converter.mka,
                            'mkv': converter.mkv,
                            'mp3': converter.mp3,
                            'mp4': converter.mp4,
                            'opus': converter.opus,
                            'vorbis': converter.vorbis,
                            'wav': converter.wav
    }
    return codec_to_converter[codec](*params)


def clean_up():
    os.remove(session["uploaded_file_path"])
    log.info(f'Deleted {session["uploaded_file_path"]}')
    os.remove(f'conversions/{session["converted_file_name"]}')
    log.info(f'Deleted conversions/{session["converted_file_name"]}')


@app.route('/', methods=['POST'])
def homepage():
    if request.form['request_type'] =='uploaded':
        log.info(f'Upload complete at {datetime.now().strftime("%H:%M:%S")}')
        log.info(request.files['chosen_file'])
        filename_secure = secure_filename(request.files['chosen_file'].filename)
        session['uploaded_file_path'] = os.path.join('uploads', filename_secure)
        uploaded_file_path = session['uploaded_file_path']
        # Save the uploaded file to the uploads folder.
        request.files['chosen_file'].save(session['uploaded_file_path'])
        session['progress_filename'] = f'{str(time())[:-8]}.txt'
        with open(f'ffmpeg-progress/{session["progress_filename"]}', 'w'): pass
        return session['progress_filename']

    elif request.form['request_type'] == 'convert':
        data = request.form['states']
        filename = request.form['filename']
        uploaded_file_path = os.path.join("uploads", secure_filename(filename))
        log.info(f'uploaded file path: {uploaded_file_path}')

        chosen_codec = json.loads(data)['codec']
        crf_value = json.loads(data)['crfValue']
        video_mode = json.loads(data)['videoSetting']
        is_keep_video = json.loads(data)['isKeepVideo']
        # MP3
        mp3_encoding_type = json.loads(data)['mp3EncodingType']
        mp3_bitrate = json.loads(data)['sliderValue']
        mp3_vbr_setting = json.loads(data)['mp3VbrSetting']
        # AAC
        fdk_type = json.loads(data)['aacEncodingMode']
        fdk_cbr = json.loads(data)['sliderValue']
        fdk_vbr = json.loads(data)['aacVbrMode']
        # Vorbis
        vorbis_encoding = json.loads(data)['vorbisEncodingType']
        vorbis_quality = json.loads(data)['qValue']
        # Vorbis/Opus
        opus_vorbis_slider = json.loads(data)['sliderValue']
        # AC3
        ac3_bitrate = json.loads(data)['ac3Bitrate']
        # FLAC
        flac_compression = json.loads(data)['flacCompression']
        # DTS
        dts_bitrate = json.loads(data)['dtsBitrate']
        # Opus
        opus_cbr_bitrate = json.loads(data)['sliderValue']
        opus_encoding_type = json.loads(data)['opusType']
        # WAV
        wav_bit_depth = json.loads(data)['wavBitDepth']
        # Desired filename
        output_name = request.form['output_name']
        log.info(f'output name: {output_name}')

        log.info(f'They chose {chosen_codec} | Output Filename: {output_name}')
        output_path = os.path.join('conversions', output_name)
        extension = None

        # AAC
        if chosen_codec == 'AAC':
            params = [session['progress_filename'], uploaded_file_path, is_keep_video, fdk_type, fdk_cbr,
                      fdk_vbr, output_path]
            extension = run_converter('aac', params)

        # AC3
        elif chosen_codec == 'AC3':
            params = [session['progress_filename'], uploaded_file_path, is_keep_video, ac3_bitrate, output_path]
            extension = run_converter('ac3', params)

        # ALAC
        elif chosen_codec == 'ALAC':
            params = [session['progress_filename'], uploaded_file_path, is_keep_video, output_path]
            extension = run_converter('alac', params)

        # CAF
        elif chosen_codec == 'CAF':
            params = [session['progress_filename'], uploaded_file_path, output_path]
            extension = run_converter('caf', params)

        # DTS
        elif chosen_codec == 'DTS':
            params = [session['progress_filename'], uploaded_file_path, is_keep_video, dts_bitrate, output_path]
            extension = run_converter('dts', params)

        # FLAC
        elif chosen_codec == 'FLAC':
            params = [session['progress_filename'], uploaded_file_path, is_keep_video, flac_compression,
                      output_path]
            extension = run_converter('flac', params)

        # MKA
        elif chosen_codec == 'MKA':
            params = [session['progress_filename'], uploaded_file_path, output_path]
            extension = run_converter('mka', params)

        # MKV
        elif chosen_codec == 'MKV':
            params = [session['progress_filename'], uploaded_file_path, video_mode, crf_value, output_path]
            extension = run_converter('mkv', params)

        # MP3
        elif chosen_codec == 'MP3':
            params = [session['progress_filename'], uploaded_file_path, is_keep_video, mp3_encoding_type,
                      mp3_bitrate, mp3_vbr_setting, output_path]
            extension = run_converter('mp3', params)

        # MP4
        elif chosen_codec == 'MP4':
            params = [session['progress_filename'], uploaded_file_path, video_mode, crf_value, output_path]
            extension = run_converter('mp4', params)

        # Opus
        elif chosen_codec == 'Opus':
            params = [session['progress_filename'], uploaded_file_path, opus_encoding_type, opus_vorbis_slider,
                      opus_cbr_bitrate, output_path]
            extension = run_converter('opus', params)

        # Vorbis
        elif chosen_codec == 'Vorbis':
            params = [session['progress_filename'], uploaded_file_path, vorbis_encoding, vorbis_quality,
                      opus_vorbis_slider, output_path]
            extension = run_converter('vorbis', params)

        # WAV
        elif chosen_codec == 'WAV':
            params = [session['progress_filename'], uploaded_file_path, is_keep_video, wav_bit_depth,
                      output_path]
            extension = run_converter('wav', params)

        if extension['error'] is not None:
            return extension, 500
        else:
            # Filename after conversion.
            session["converted_file_name"] = f'{output_name}{extension["ext"]}'
            return extension


@app.route('/ffmpeg-progress/<filename>')
def get_file(filename):
    log.info('downloadm hit')
    log.info(filename)
    return send_from_directory('ffmpeg-progress', filename)


@app.route('/ffmpeg_output/<filename>')
def get_ffmpeg_output(filename):
    log.info(filename)
    return send_from_directory('ffmpeg_output', filename)


# app.js directs the user to this URL when the conversion is complete.
@app.route('/uploads/<filename>', methods=['GET'])
def send_file(filename):
    log.info(f'{datetime.now().strftime("[%H:%M:%S]")} https://free-av-tools.com/conversions/{filename}')
    mimetype_value = 'audio/mp4' if os.path.splitext(filename)[1] == '.m4a' else ''
    try:
        return send_from_directory('uploads', filename, mimetype=mimetype_value, as_attachment=True)
    except Exception as error:
        log.error(f'Unable to send conversions/{filename}. Error: \n{error}')

    
# Game 1
@app.route('/game', methods=['POST'])
def return_world_record():
    current_datetime = datetime.now().strftime('%d-%m-%y at %H:%M:%S')
    user = request.environ.get('HTTP_X_REAL_IP').split(',')[0]
    user_agent = request.headers.get('User-Agent')
    score = request.form['score']
    times_missed = request.form['times_missed']
    canvas_width = request.form['canvas_width']
    canvas_height = request.form['canvas_height']
    try:
        int(score)
        int(times_missed)
        int(canvas_width)
        int(canvas_height)
    except ValueError:
        log.error('[Game 1] The user changed something to a non-int.')
    else:
        os.makedirs('GameScores', exist_ok=True)
        with open('GameScores/HighScores.txt', 'a') as f:
                f.write(f'{score} | {times_missed} | {user} | {user_agent} | {canvas_width}'
                        f'x{canvas_height} | {current_datetime}\n')
    finally:
        just_scores = []
        with open('GameScores/HighScores.txt', 'r') as f:
            lines = f.readlines()
            for line in lines:
                just_scores.append(line.split('|')[0].strip())
        return ''


# Game 2
@app.route('/game2', methods=['POST'])
def save_game2_stats():
    current_datetime = datetime.now().strftime('%d-%m-%y at %H:%M:%S')
    user = request.environ.get('HTTP_X_REAL_IP').split(',')[0]
    user_agent = request.headers.get('User-Agent')
    reaction_time = request.form['reaction_time']
    try:
        int(reaction_time)
    except ValueError:
        log.error('[Game 2] The user changed reaction_time to a non-int.')
    else:
        os.makedirs('GameScores', exist_ok=True)
        with open('GameScores/ReactionTimes.txt', 'a') as f:
            f.write(f'{reaction_time} ms | {user} | {user_agent} | {current_datetime}\n')
    finally:
        reaction_times = []
        with open('GameScores/ReactionTimes.txt', 'r') as f:
            lines = f.readlines()
            for line in lines:
                reaction_times.append(line.split('|')[0][:-3].strip())
        return ''


@app.route('/')
def homepage_visited():
    return render_template('index.html')


@app.route('/about')
def about_page_visited():
    log_visit('visited about page')
    return render_template('about.html', title='About')


@app.route('/filetypes')
def filetypes_visited():
    log_visit('visited filetypes')
    return render_template('filetypes.html', title='Filetypes')


@app.route('/yt')
def yt_page_visited():
    log_visit('visited YT')
    return render_template('yt.html', title='YouTube downloader')


@app.route('/trimmer')
def trimmer_visited():
    log_visit('visited trimmer')
    return render_template('trimmer.html', title='File Trimmer')


@app.route('/contact')
def contact_page_visited():
    log_visit('visited contact page')
    return render_template('contact.html', title='Contact')


@app.route('/game')
def game_visited():
    log_visit('visited game')
    return render_template('game.html', title='Game')


@app.route('/game2')
def game2_visited():
    log_visit('visited game 2')
    return render_template('game2.html', title='Game 2')


@app.route('/chat')
def chat():
    log_visit('visited chat')
    return render_template('chat.html', title='Chat')

    
# Users online counter for /chat
count = 0


@socketio.on('connect')
def connect():
    global count
    count += 1
    socketio.emit('user connected', count)


@socketio.on('disconnect')
def disconnect():
    global count
    count -= 1
    socketio.emit('user disconnected', count)


@socketio.on('typing')
def show_typing(username):
    socketio.emit('show typing', username)


@socketio.on('nottyping')
def show_typing():
    socketio.emit('show stopped typing')


@socketio.on('message sent')
def handle_message(message):
    socketio.emit('show message', message)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
