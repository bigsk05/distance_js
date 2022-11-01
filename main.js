/** 长半径a=6378137 */
let a = 6378137;
/** 短半径b=6356752.314245 */
let b = 6356752.314245;
/** 扁率f=1/298.257223563 */
let f = 1 / 298.257223563;

/**
 * 根据提供的经纬度计算两点间距离
 *
 * @param lat_one 坐标1纬度
 * @param lon_one 坐标1经度
 * @param lat_two 坐标2纬度
 * @param lon_two 坐标2经度
 * @return 两点间距离
 */
function getDistance(lat_one, lon_one, lat_two, lon_two) {
    let L = toRadians(lon_one - lon_two);
    let U1 = Math.atan((1 - f) * Math.tan(toRadians(lat_one)));
    let U2 = Math.atan((1 - f) * Math.tan(toRadians(lat_two)));
    let sinU1 = Math.sin(U1), cosU1 = Math.cos(U1),
            sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
    let lambda = L, lambdaP = Math.PI;
    let cosSqAlpha = 0, sinSigma = 0, cos2SigmaM = 0, cosSigma = 0, sigma = 0;
    let circleCount = 40;
    //迭代循环
    while (Math.abs(lambda - lambdaP) > 1e-12 && --circleCount > 0) {
        let sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
        sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
                (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
        if (sinSigma == 0) {
            return 0;  // co-incident points
        }
        cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);
        let alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
        cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
        cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
        let C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1 - C) * f * Math.sin(alpha) *
                (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    }
    if (circleCount == 0) {
        return NaN;  // formula failed to converge
    }
    let uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    let A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    let B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    let deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));

    let result = b * A * (sigma - deltaSigma) / 1000;
    return result;
}

/**
 * 根据提供的角度值，将其转化为弧度
 *
 * @param angle 角度值
 * @return 结果
 */
function toRadians(angle) {
    let result = 0;
    if (angle != null) {
        result = angle * Math.PI / 180;
    }
    return result;
}


function main(args) {
    // TODO Auto-generated method stub
    //坐标1经度
    let lon_one = 1;
    //坐标1纬度
    let lat_one = 2;
    //坐标2经度
    let lon_two = 3;
    //坐标2纬度
    let lat_two = 4;
    let distance = getDistance(lat_one, lon_one, lat_two, lon_two);
    console.log(distance);
}

main();