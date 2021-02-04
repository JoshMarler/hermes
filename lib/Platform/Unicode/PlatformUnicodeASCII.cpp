/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "hermes/Platform/Unicode/PlatformUnicode.h"

#include <cuchar>
#include <iostream>

#if HERMES_PLATFORM_UNICODE == HERMES_PLATFORM_UNICODE_ASCII_ONLY

namespace hermes {
namespace platform_unicode {

static inline std::u16string StringtoU16(const std::string &str) {
    std::u16string wstr = u"";
    char16_t c16str[3] = u"\0";
    mbstate_t mbs;
    for (const auto& it: str){
        memset (&mbs, 0, sizeof (mbs));//set shift state to the initial state
        memmove(c16str, u"\0\0\0", 3);
        mbrtoc16 (c16str, &it, 3, &mbs);
        wstr.append(std::u16string(c16str));
    }//for
    return wstr;
}

static inline std::string U16toString(const std::u16string &wstr) {
    std::string str = "";
    char cstr[3] = "\0";
    mbstate_t mbs;

    for (const auto& it: wstr)
    {
        memset (&mbs, 0, sizeof (mbs));
        memmove(cstr, "\0\0\0", 3);
        c16rtomb (cstr, it, &mbs);
        str.append(std::string(cstr));
    }

    return str;
}

int localeCompare(
    llvh::ArrayRef<char16_t> left,
    llvh::ArrayRef<char16_t> right) {

    std::cout << "localeCompare" << std::endl;

    std::string a = U16toString(std::u16string(left.data(), left.size()));
    std::string b = U16toString(std::u16string(right.data(), right.size()));

    if (a == b)
        return 0;

    auto isLess = std::lexicographical_compare(a.begin(), a.end(), b.begin(), b.end());
    return isLess ? -1 : 1;
}

void dateFormat(
    double unixtimeMs,
    bool formatDate,
    bool formatTime,
    llvh::SmallVectorImpl<char16_t> &buf) {
  // FIXME: implement this.
  llvh::ArrayRef<char> str{"dateFormat not implemented"};
  buf.assign(str.begin(), str.end());
    std::cout << "dateFormat" << std::endl;
}

void convertToCase(
    llvh::SmallVectorImpl<char16_t> &str,
    CaseConversion targetCase,
    bool useCurrentLocale) {

    std::string charStr = U16toString(std::u16string(str.begin(), str.end()));

    std::transform(charStr.begin(), charStr.end(), charStr.begin(), [=] (unsigned char c)
    {
        if (targetCase == CaseConversion::ToLower)
            return std::tolower(c);
        else
            return std::toupper((c));
    });

    std::u16string char16Str = StringtoU16(charStr);

    for (size_t i = 0; i < str.size(); ++i)
    {
       str[i] = char16Str[i];
    }
}

void normalize(llvh::SmallVectorImpl<char16_t> &buf, NormalizationForm form) {
  // FIXME: implement this.
    std::cout << "convertToCase" << std::endl;
}

} // namespace platform_unicode
} // namespace hermes

#endif // HERMES_PLATFORM_UNICODE_ASCII
