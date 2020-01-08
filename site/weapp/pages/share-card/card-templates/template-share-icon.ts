import Template from './template.interface';
import ImageService from '../card-service/image.service';
import { CommonService } from '../../../service/common.service';
import { wxm } from '../../../service/wx-method.service';
import { ShareCardType } from '../card-service/card-type';

// 方便书写
const rpx = CommonService.rpx;

export default class Template02 extends Template {

    constructor(data: any) {
        super(null, null);

        this.ctx = wx.createCanvasContext('shareCard');
        this._data = data;
    }

    private ctx: wx.CanvasContext;
    private _data: any;

    public static bgImages: string[] = [
    ];

    /**
     * 推荐此方法实例化该类
     * @param data 
     */
    public static newInstance(data: any): Template02 {
        return new Template02(data);
    }

    public bgImagesCount(): number {
        return 0;
    }

    public async draw(): Promise<string> {
        const ctx = this.ctx;
        const w = rpx`420`;
        const h = rpx`337`;

        const [
            presentIcon,
            headImage,
            buttonIcon,
        ] = await Promise.all([
            ImageService.loadImage('https://img.qlchat.com/qlLive/liveCommon/present-icon.png'),
            ImageService.loadImage(this._data.headImage + '@420w_266h_1e_1c_2o'),
            ImageService.loadImage('https://img.qlchat.com/qlLive/liveComment/5Y7GA2T6-FW4Z-1QMB-1523156622210-AK9UM67VLZ8P.png'),
        ]);

        ctx.drawImage(headImage, 0, 0, w, rpx`266`);
        ctx.drawImage(presentIcon, 0, 0, rpx`109`, rpx`109`);
        ctx.drawImage(buttonIcon, 0, rpx`273`, w, rpx`64`);

        return await this.getTempFilePath(ctx, w, h);
    }

}
