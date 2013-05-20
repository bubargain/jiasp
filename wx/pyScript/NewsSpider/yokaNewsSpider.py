#-*- coding: utf-8 -*-


import newsSpider
from bs4 import BeautifulSoup
import re,sys
import config

reload(sys)
sys.setdefaultencoding('utf-8') 

class yokaNewsSpider(newsSpider.NewsSpider):
    CatagoryList = ['c12','c2','c1','c9','c13','c6','c3']
    CatagoryName = ['时尚精华','时装','美容','奢侈品','座驾','明星','生活']
    ROOTSITE = 'http://3g.yoka.com/'
    
    def test(self):
        print "this is yokaNewsSpider"
        
    def start(self,start=1,end=3):
        self.parseCategoryPageUrl(self.ROOTSITE,start,end)
        
    '''
             解析主分类页
    '''
    def parseCategoryPageUrl(self,URL,start,end):
        for i in self.CatagoryList:
            self.parseListPageUrl(URL+'m/'+i,start,end,self.CatagoryList.index(i))
     
    '''
            解析列表页
    '''
    def parseListPageUrl(self,URL,start,end,cataId):
        for i in range(start,end):
            finalUrl= URL+'_'+str(i)
            soup = self.parseUrl(finalUrl)
            mainDivSoup = soup.find('div',id='main')
            if mainDivSoup:
                newsLink = mainDivSoup.find_all('a')
                for link in newsLink:
                    tlink = link['href']
                    if tlink[:5] =='/m/id':
                        self.parseNewsPage(self.ROOTSITE+tlink,cataId)
    
    '''
            解析具体新闻页
    '''
    def parseNewsPage(self,URL,cataId):
        import datetime
        try:
            content = self.parseUrl(URL)
            print "starting URL: ",URL , "at ",datetime.datetime.now()
            if content:
                mainDiv=content.find('div',id='main')
            soupResult={}
            title=mainDiv.h1.text
            soupResult['title'] = re.sub(' ','',title) #去空格
            soupResult['from_url'] = URL
            date_str = mainDiv.find('span').text
            date_str = re.search('\d*/\d*/\d*',date_str)
            fdate = re.sub('/','-',date_str.group())
            soupResult['date_str'] = fdate
            soupResult['from'] = self.CatagoryName[cataId]
            
            #print soupResult
            neirong= mainDiv.find('div',class_='bdsnr')
            for tag in neirong():
                for attribute in ['class','width','height','style']:
                    del tag[attribute]
                    
            sNeirong = re.sub('</?br/?>','',str(neirong))
            soupResult['neirong'] = sNeirong
            
            return self.post(config.API, soupResult)
        except Exception as e:
            print "[ERROR} at parseNewsPage.py :",e
    



if __name__ == "__main__":
    spider = yokaNewsSpider()
    print spider.parseNewsPage('http://3g.yoka.com/m/id226515',1)
    #spider.start()