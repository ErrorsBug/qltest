import { AudioPlayer } from '../../../../../../comp/audio-player'

class AudioBarComponent {
    properties = {
        courseName: String,
        audios: {
            type: Array,
            observer:'onAudiosChange'
        },
    }

    data = {
        status: 'stop',
        totalDuration: 0,

        uri_icon_play: __uri('./img/icon-play.png'),
        uri_icon_playing: __uri('./img/icon-playing.gif'),
    }

    ready() {

    }

    detached() {
        if (this.play) {
            this.player.stop()
            this.player = null;
        }
    }

    methods = {
        onAudiosChange() {
            let { totalDuration, audios } = this.data  

            totalDuration = audios.map(item => item.time)
                .reduce((a, b) => a + b, 0)
            this.audioUrls = audios.map(item => item.url)
            
            this.setData({ totalDuration })
        },
        initPlayer() {
            this.curIndex = 0

            this.player = new AudioPlayer({
                title: this.data.courseName,
                onPlay: (e) => {
                    this.setData({ status: 'playing' })
                },
                onPause: (e) => {
                    this.setData({ status: 'paused' })
                },
                onStop: (e) => {
                    this.setData({ status: 'stop' })
                },
                onEnded: (e) => {
                    if (this.curIndex + 1 < this.audioUrls.length) {
                        this.curIndex++
                        this.playAudio()
                    } else {
                        this.curIndex = 0
                        this.setData({ status: 'stop' })
                    }
                },
            })
        },
        onAudioBarTap() {
            const { status } = this.data

            if (!this.audioUrls.length) { return }
            if (!this.player) {
                this.initPlayer()
            }
            if (status !== 'playing') {
                this.playAudio()
            } else {
                this.player.pause()
            }
        },
        playAudio() {
            this.player.play(this.audioUrls[this.curIndex])
        }
    }
}

Component(new AudioBarComponent())
