import React from 'react';
import ReactDOM from 'react-dom';
import FacebookProvider, { Comments } from 'react-facebook';

const UrbanRenewalUnitInfo = (props) => (
    <div style={{ width: '600px' }}>
        <div className="pre-scrollable"
            style={{ maxHeight: '500px' }}
        >
            <div className="panel-group">
                <div className="panel panel-info">
                    <div className="panel-heading">更新單元資料</div>
                    <div className="panel-body">
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>更新案名</td>
                                    <td>{props.popupDetail.casename}</td>
                                </tr>
								<tr>
                                    <td>更新案號</td>
                                    <td>{props.popupDetail.OfficialId}</td>
                                </tr>
                                <tr>
									<td>行政區</td>
                                    <td>{props.popupDetail.city}{props.popupDetail.adminDist}</td>
                                </tr>
                                <tr>
                                    <td>劃定類型</td>
                                    <td>{props.popupDetail.type}</td>
                                </tr>
                                <tr>
                                    <td>狀態</td>
                                    <td>{props.popupDetail.status}</td>
                                </tr>
								<tr>
                                    <td>基地面積</td>
                                    <td>{props.popupDetail.area}</td>
                                </tr>
								{
                                    props.popupDetail.officialDocs && (
                                        <tr>
                                            <td>官方公告</td>
                                            <td>
                                                {
                                                    props.popupDetail.officialDocs.map((doc, i) => {
                                                        return (
                                                            <a style={{ marginRight: '15px' }}
                                                                href={doc.url}
                                                                target="_blank">
                                                                {doc.docName}
                                                            </a>
                                                        );
                                                    })
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
					<div className="panel-footer text-center">
						<a className="btn btn-danger btn-fill btn-md" target ="_blank" href="report/professional.pdf">看專業版</a>
					</div>
                </div>
				<div className="panel panel-danger">
                    <div className="panel-heading">相關新聞</div>
                    <div className="panel-body">
                        {
                            props.popupDetail.news && (
                                <table className="table table-striped">
                                    <tbody>
                                        {
                                            props.popupDetail.news.map((n, i) => {
                                                return (
                                                    < tr >
                                                        <td>
                                                            <a style={{ marginRight: '15px' }}
                                                                href={n.url}
                                                                target="_blank">
                                                                {n.title}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            )
                        }
                        {
                            !props.popupDetail.news && (<span>我不有名...</span>)
                        }
                    </div>
                </div>
            </div>

            {/*
            { "city": "臺北市", 
            "adminDist": "大安區", 
            "casename": "臺北市大安區懷生段二小段16地號等6筆土地為更新單元", 
            "type": "自行劃定", 
            "status": "有效", 
            "OfficialId": "95.2.16府都新字第09572893600號", 
            "officialDocs": [ 
                { "docName": "公告", "url": "http://uro.gov.taipei/public/MMO/uro/%E5%A4%A7%E5%AE%89%E5%8D%80A0020.pdf" }, 
            { "docName": "計畫書(pdf)", "url": "http://uro.gov.taipei/public/MMO/uro/%E5%A4%A7%E5%AE%89%E5%8D%80B0020.pdf" }, 
            { "docName": "計畫圖(pdf)", "url": "http://uro.gov.taipei/public/MMO/uro/%E5%A4%A7%E5%AE%89%E5%8D%80P0020.jpg" } ], 
            "news": [ 
                { "title": "正義國宅都更案 拖20年 終於動了", "url": "http://news.ltn.com.tw/news/focus/paper/1080514" }, 
                { "title": "正義國宅都更 建商話辛酸：背殺人罪名、填130億錢坑", "url": "http://news.ltn.com.tw/news/business/breakingnews/1988377" }, 
                { "title": "伏殺大地主 2槍轟爆頭", "url": "http://www.appledaily.com.tw/appledaily/article/headline/20090217/31398430/" }, 
                { "title": "精華區都更身價驚人 元大栢悅漲近1.14倍", "url": "http://news.ltn.com.tw/news/business/paper/1106831" }, 
                { "title": "延宕20年 正義國宅都更案啟動", "url": "http://www.chinatimes.com/newspapers/20160927000044-260202" }, 
                { "title": "正義國宅都更　他是關鍵拔釘人", "url": "http://www.appledaily.com.tw/realtimenews/article/new/20170227/1062996/" }, 
                { "title": "台北市正義國宅都更 120.9億聯貸案簽約啟動", "url": "https://udn.com/news/story/7323/2300047" }, 
                { "title": "歷經槍擊案、三次轉手　正義國宅終於要「動」了！", "url": "http://www.ettoday.net/news/20170223/872577.html" } ], 
                "summary": "本計畫分為A、B兩區段:A區段:位於大安區忠孝東路3段、忠孝東路3段248巷、忠孝東路3段248巷7弄、忠孝東路276巷所圍之完整街廓,土地面積為3,914平方公尺", "area": "A、B區段合計5,041平方公尺" }
            */}
            {/*JSON.stringify(props.popupDetail, null, 2)*/}

            <div className='well'>
                <FacebookProvider appId="1861039190814893" language="zh_TW">
                    <Comments href={"https://urban-renewal.herokuapp.com/map.html#" + props.popupDetail.OfficialId} />
                </FacebookProvider>
            </div>
        </div>
    </div>
);


export default UrbanRenewalUnitInfo;