import Template from './template.interface';
import ImageService from '../card-service/image.service';
import { CommonService } from '../../../service/common.service';
import { wxm } from '../../../service/wx-method.service';
import { ShareCardType } from '../card-service/card-type';

// 方便书写
const rpx = CommonService.rpx;

export default class Template02 extends Template {

    constructor(type: ShareCardType, shareData: any) {
        super(type, shareData);

        this.ctx = wx.createCanvasContext('shareCard');
        this._type = type;
        this._shareData = shareData;
    }

    private ctx: wx.CanvasContext;
    private _type: ShareCardType;
    private _shareData: any;

    public static bgImages: string[] = [
        'https://img.qlchat.com/qlLive/adminImg/RAGLA6KJ-XO72-CNXO-1521624613803-UDG9HW8DRZ8O.jpg',
    ];

    /**
     * 推荐此方法实例化该类
     * @param type 
     */
    public static newInstance(type: ShareCardType, shareData: any): Template02 {
        return new Template02(type, shareData);
    }

    public bgImagesCount(): number {
        return Template02.bgImages.length;
    }

    public async draw(pos: number): Promise<string> {
        const ctx = this.ctx;
        const w = rpx`640`;
        const h = rpx`1136`;

        const [
            bgImage,
            userHeadImage,
            qrcode,
            fingerIcon,
        ] = await Promise.all([
            ImageService.loadImage(Template02.bgImages[pos]),
            ImageService.loadImage(this._shareData.userHeadImage + '?x-oss-process=image/resize,h_100,w_100,m_fill,limit_0'),
            ImageService.loadImage(this._shareData.qrCode),
            ImageService.loadImage('https://img.qlchat.com/qlLive/sharecard/fingerprint.png'),
        ]);

        // 画背景
        ctx.drawImage(bgImage, 0, 0, w, h);

        // 画用户头像
        this.drawRoundImage(ctx, userHeadImage, rpx`299`, rpx`237`, rpx`20`);

        // 设置文字的通用属性
        ;(ctx as any).textBaseline = 'top';

        // 用户名
        ctx.save();
        (ctx as any).setTextAlign('center');
        ctx.setFillStyle('#dc5d5d');
        ctx.setFontSize(rpx`22`);
        ctx.fillText(this._shareData.userName, rpx`320`, rpx`284`);
        ctx.fillText('发现了一门好课', rpx`320`, rpx`310`);
        ctx.restore();

        // 画标题
        ctx.save();
        let channelName = this._shareData.name;
        ctx.setFillStyle('#000000');
        (ctx as any).setTextAlign('center');
        this.multiLineText(ctx, channelName, rpx`539`, rpx`50`, rpx`34`, rpx`320`, rpx`385`);
        ctx.restore();

        ctx.save();
        ctx.drawImage(qrcode, rpx`175`, rpx`968`, rpx`112`, rpx`112`);
        ctx.drawImage(fingerIcon, rpx`353.5`, rpx`964`, rpx`119.5`, rpx`119.5`);

        ctx.setFillStyle('#ffffff');
        ctx.setFontSize(rpx`22`);
        (ctx as any).setTextAlign('center');
        ctx.fillText('长按识别二维码，一起参加学习', rpx`320`, rpx`1088`);
        ctx.restore();

        return await this.getTempFilePath(ctx, rpx`640`, rpx`1136`);
    }

}
