#import <Cocoa/Cocoa.h>

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc != 2) {
            fprintf(stderr, "Usage: make-icon output.png\n");
            return 1;
        }

        NSSize size = NSMakeSize(1024, 1024);
        NSImage *image = [[NSImage alloc] initWithSize:size];
        [image lockFocus];

        NSRect iconRect = NSMakeRect(52, 52, 920, 920);
        NSBezierPath *outer = [NSBezierPath bezierPathWithRoundedRect:iconRect xRadius:218 yRadius:218];
        NSGradient *gradient = [[NSGradient alloc]
            initWithStartingColor:[NSColor colorWithCalibratedRed:0.035 green:0.075 blue:0.145 alpha:1]
                       endingColor:[NSColor colorWithCalibratedRed:0.055 green:0.235 blue:0.265 alpha:1]];
        [gradient drawInBezierPath:outer angle:-45];

        [[NSColor colorWithCalibratedWhite:1 alpha:0.09] setStroke];
        outer.lineWidth = 7;
        [outer stroke];

        NSBezierPath *chart = [NSBezierPath bezierPath];
        [chart moveToPoint:NSMakePoint(222, 310)];
        [chart lineToPoint:NSMakePoint(390, 455)];
        [chart lineToPoint:NSMakePoint(530, 410)];
        [chart lineToPoint:NSMakePoint(762, 692)];
        chart.lineCapStyle = NSLineCapStyleRound;
        chart.lineJoinStyle = NSLineJoinStyleRound;
        chart.lineWidth = 64;
        [[NSColor colorWithCalibratedRed:0.30 green:0.90 blue:0.73 alpha:1] setStroke];
        [chart stroke];

        NSBezierPath *arrow = [NSBezierPath bezierPath];
        [arrow moveToPoint:NSMakePoint(645, 692)];
        [arrow lineToPoint:NSMakePoint(762, 692)];
        [arrow lineToPoint:NSMakePoint(762, 575)];
        arrow.lineWidth = 52;
        arrow.lineCapStyle = NSLineCapStyleRound;
        arrow.lineJoinStyle = NSLineJoinStyleRound;
        [arrow stroke];

        NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
        style.alignment = NSTextAlignmentCenter;
        NSDictionary *attributes = @{
            NSFontAttributeName: [NSFont systemFontOfSize:88 weight:NSFontWeightSemibold],
            NSForegroundColorAttributeName: [NSColor colorWithCalibratedWhite:1 alpha:0.88],
            NSParagraphStyleAttributeName: style,
            NSKernAttributeName: @8
        };
        [@"LONG VIEW" drawInRect:NSMakeRect(120, 132, 784, 120) withAttributes:attributes];

        [image unlockFocus];

        NSBitmapImageRep *bitmap = [[NSBitmapImageRep alloc] initWithData:image.TIFFRepresentation];
        NSData *png = [bitmap representationUsingType:NSBitmapImageFileTypePNG properties:@{}];
        NSString *path = [NSString stringWithUTF8String:argv[1]];
        if (![png writeToFile:path atomically:YES]) {
            fprintf(stderr, "Unable to render icon\n");
            return 1;
        }
    }
    return 0;
}
