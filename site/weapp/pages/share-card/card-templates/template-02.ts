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
        'https://img.qlchat.com/qlLive/adminImg/A5CYXUBY-5Z6I-3PJZ-1518056753849-U6XUIHNXGKEG.jpg',
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
            headImage,
            userHeadImage,
            qrcode,
        ] = await Promise.all([
            ImageService.loadImage(Template02.bgImages[pos]),
            ImageService.loadImage(this._shareData.headImage),
            ImageService.loadImage(this._shareData.userHeadImage + '?x-oss-process=image/resize,h_100,w_100,m_fill,limit_0'),
            ImageService.loadImage(this._shareData.qrCode),
        ]);

        ctx.drawImage(bgImage, 0, 0, w, h);

        // 画头图
        ctx.save();
        ctx.drawImage(headImage, rpx`23`, rpx`31`, rpx`593`, rpx`370`);
        ctx.restore();

        // 画用户头像
        this.drawRoundImage(ctx, userHeadImage, rpx`262`, rpx`935.4`, rpx`15`);

        // 设置文字的通用属性
        ;(ctx as any).textBaseline = 'top';

        // 画标题
        ctx.save();
        let channelName = this._shareData.name;
        ctx.setFillStyle('#23265f');
        this.multiLineText(ctx, channelName, rpx`481`, rpx`42`, rpx`30`, rpx`78`, rpx`631`);
        ctx.restore();

        // 用户名
        ctx.save();
        ctx.setFillStyle('#23265f');
        ctx.setFontSize(rpx`20`);
        ctx.fillText(this._shareData.userName, rpx`302`, rpx`935`);
        ctx.restore();

        // 直播间名
        ctx.save();
        
        ctx.setFillStyle('#8687f4');
        ctx.setFontSize(rpx`28`);
        ctx.fillText('直播间', rpx`86`, rpx`837`);

        ctx.setFillStyle('#23265f');
        ctx.setFontSize(rpx`26`);
        let liveName = this.splitTextByMaxWith(ctx, this._shareData.liveName, rpx`200`);
        ctx.fillText(liveName, rpx`185`, rpx`840`);

        ctx.restore();

        ctx.save();
        ctx.drawImage(qrcode, rpx`421`, rpx`748`, rpx`135`, rpx`135`);
        ctx.restore();

        return await this.getTempFilePath(ctx, rpx`640`, rpx`1136`);
    }

}
