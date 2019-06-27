#import "Gomobile.h"
#import <UIKit/UIKit.h>

@implementation Gomobile

RCT_EXPORT_MODULE(PrivacyGo);

//exports a method getDeviceName to javascript
RCT_EXPORT_METHOD(aggregatedRangeProve:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileAggregatedRangeProve(data);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}


@end