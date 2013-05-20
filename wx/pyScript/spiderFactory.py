#encoding:utf-8

import sys
sys.path.append('NewsSpider')
from graziaNewsSpider import *
from haibaoNewsSpider import *
from yokaNewsSpider import *
      

'''
    通过初始化参数来决定是对那个网站来进行抓取
  可选参数列表  ‘grazia','',
'''
class simpleSpiderFactory():

    @staticmethod
    def createSpider(siteName):
        instanceName = siteName+'NewsSpider'
        try:
            return eval(instanceName)()
        except Exception as e:
            print "[Error] when call spiderFactory",e

'''
测试访问grazia工厂类
'''
