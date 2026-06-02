import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { branding, formatDate } from '@/config/branding.config';
// Use a small, optimized logo variant for PDF embedding to keep payload size low.
// The large public logo (~880KB) would balloon the base64 attachment past Vercel's body limit.
import pdfLogo from '@/assets/brand-logo-pdf.png';
import type { Invoice } from '@/types/common';

// Use built-in Helvetica (default) for guaranteed glyph coverage and small bundle.
// No external font registration to keep PDFs portable.

const BRAND = '#712c2d';
const BORDER = '#000000';
const HEADER_BG = '#f2f2f2';

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 9,
        fontFamily: 'Helvetica',
        color: '#000',
        backgroundColor: '#fff',
    },
    outer: {
        flexGrow: 1,
        borderWidth: 1,
        borderColor: BORDER,
        margin: 12,
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    brand: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: BRAND, marginBottom: 4 },
    small: { fontSize: 9, lineHeight: 1.4 },
    logo: { width: 90, height: 90, objectFit: 'contain' },
    hr: { borderTopWidth: 1, borderColor: BORDER },
    detailsRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: BORDER },
    detailsCol: { flex: 1, padding: 10 },
    detailsColLeft: { flex: 1, padding: 10, borderRightWidth: 1, borderColor: BORDER },
    sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: BRAND, marginBottom: 4 },
    bold: { fontFamily: 'Helvetica-Bold' },
    itemsHeaderBar: { paddingHorizontal: 10, paddingVertical: 6 },
    table: { borderTopWidth: 1, borderColor: BORDER },
    tr: { flexDirection: 'row' },
    th: {
        borderRightWidth: 1, borderBottomWidth: 1, borderColor: BORDER,
        padding: 5, fontFamily: 'Helvetica-Bold', backgroundColor: HEADER_BG,
        textAlign: 'center', fontSize: 9,
    },
    td: {
        borderRightWidth: 1, borderBottomWidth: 1, borderColor: BORDER,
        padding: 5, fontSize: 9,
    },
    // column widths sum 100
    cSr: { width: '7%' },
    cCode: { width: '14%' },
    cName: { width: '25%' },
    cMat: { width: '16%' },
    cQty: { width: '12%' },
    cPrice: { width: '13%' },
    cTotal: { width: '13%' },
    textCenter: { textAlign: 'center' },
    textRight: { textAlign: 'right' },
    totalRowLabel: {
        borderRightWidth: 1, borderBottomWidth: 1, borderColor: BORDER,
        padding: 5, fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'right',
        width: '87%',
    },
    totalRowValue: {
        borderRightWidth: 1, borderBottomWidth: 1, borderColor: BORDER,
        padding: 5, fontSize: 9, textAlign: 'right', width: '13%',
    },
    grandLabel: { backgroundColor: HEADER_BG, fontSize: 11 },
    grandValue: { backgroundColor: HEADER_BG, fontSize: 11, color: BRAND, fontFamily: 'Helvetica-Bold' },
    footer: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderColor: BORDER,
        padding: 10,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
    },
    link: { color: '#000', textDecoration: 'underline' },
});

interface Props { invoice: Invoice }

export function InvoicePDFDocument({ invoice }: Props) {
    const c = invoice.customerSnapshot;

    return (
        <Document
      title= {`${branding.primaryBrand} Invoice ${invoice.invoiceNumber}`
}
author = { branding.primaryBrand }
subject = {`Invoice ${invoice.invoiceNumber}`}
    >
    <Page size="A4" style = { styles.page } wrap >
        <View style={ styles.outer }>
            {/* Header */ }
            < View style = { styles.header } >
                <View style={ { flex: 1 } }>
                    <Text style={ styles.brand }> { branding.primaryBrand } </Text>
{
    branding.company.address.map((line, i) => (
        <Text key= { i } style = { styles.small } > { line } </Text>
    ))
}
<Text style={ [styles.small, { marginTop: 6 }] }>
    <Text style={ styles.bold }> Email: </Text>{branding.company.email}
        </Text>
        < Text style = { styles.small } >
            <Text style={ styles.bold }> Website: </Text>
                < Link src = { branding.company.website.url } style = { styles.link } >
                    { branding.company.website.label }
                    </Link>
                    </Text>
                    </View>
                    <View>
{/* Image src must resolve to a URL at runtime (Vite import handles this) */ }
<Image src={ pdfLogo } style = { styles.logo } />
    </View>
    </View>

    < View style = { styles.hr } />

        {/* Details */ }
        < View style = { styles.detailsRow } >
            <View style={ styles.detailsColLeft }>
                <Text style={ styles.sectionTitle }> Invoice Details </Text>
                    < Text style = { styles.small } > <Text style={ styles.bold }> Invoice No: </Text>{invoice.invoiceNumber}</Text >
                        <Text style={ styles.small }> <Text style={ styles.bold }> Date: </Text>{formatDate(invoice.date)}</Text >
                            <Text style={ styles.small }> <Text style={ styles.bold }> Payment Method: </Text>{invoice.paymentMethod}</Text >
                                </View>
                                < View style = { styles.detailsCol } >
                                    <Text style={ styles.sectionTitle }> To: </Text>
                                        < Text style = { [styles.small, styles.bold]} > { c.name } </Text>
                                            < Text style = { styles.small } > { c.address } </Text>
                                                < Text style = { styles.small } > <Text style={ styles.bold }> Email: </Text>{c.email}</Text >
                                                {
                                                    c.contactNumber ? (
                                                        <Text style= { styles.small } > <Text style={ styles.bold }> Contact: </Text>{c.contactNumber}</Text >
              ) : null}
</View>
    </View>

{/* Items title */ }
<View style={ styles.itemsHeaderBar }>
    <Text style={ styles.sectionTitle }> Items </Text>
        </View>

{/* Items table */ }
<View style={ styles.table }>
    <View style={ styles.tr } fixed >
        <Text style={ [styles.th, styles.cSr] }> Sr.No.</Text>
            < Text style = { [styles.th, styles.cCode]} > Product Code </Text>
                < Text style = { [styles.th, styles.cName]} > Product Name </Text>
                    < Text style = { [styles.th, styles.cMat]} > Raw Material </Text>
                        < Text style = { [styles.th, styles.cQty]} > Qty </Text>
                            < Text style = { [styles.th, styles.cPrice]} > INR / Unit </Text>
                                < Text style = { [styles.th, styles.cTotal]} > Total </Text>
                                    </View>

{
    invoice.items.map((it, idx) => (
        <View key= { it.productId } style = { styles.tr } wrap = { false} >
        <Text style={ [styles.td, styles.cSr, styles.textCenter]} > { idx + 1} </Text>
            < Text style = { [styles.td, styles.cCode, styles.textCenter]} > { it.productCode } </Text>
                < Text style = { [styles.td, styles.cName, styles.textCenter]} > { it.productName } </Text>
                    < Text style = { [styles.td, styles.cMat, styles.textCenter]} > { it.material } </Text>
                        < Text style = { [styles.td, styles.cQty, styles.textCenter]} > { it.quantity } { it.unit } </Text>
                            < Text style = { [styles.td, styles.cPrice, styles.textRight]} > { Number(it.unitPrice).toFixed(2) } </Text>
                                < Text style = { [styles.td, styles.cTotal, styles.textRight]} > { Number(it.total).toFixed(2) } </Text>
                                    </View>
            ))}

<View style={ styles.tr }>
    <Text style={ styles.totalRowLabel }> Subtotal </Text>
        < Text style = { styles.totalRowValue } > { Number(invoice.subtotal).toFixed(2) } </Text>
            </View>
            < View style = { styles.tr } >
                <Text style={ styles.totalRowLabel }> { branding.invoice.taxLabel } </Text>
                    < Text style = { styles.totalRowValue } > { Number(invoice.tax).toFixed(2) } </Text>
                        </View>
                        < View style = { styles.tr } >
                            <Text style={ [styles.totalRowLabel, styles.grandLabel] }> Grand Total </Text>
                                < Text style = { [styles.totalRowValue, styles.grandValue]} > { Number(invoice.total).toFixed(2) } </Text>
                                    </View>
                                    </View>

{/* Footer */ }
<Text style={ styles.footer } fixed > { branding.invoice.footer } </Text>
    </View>
    </Page>
    </Document>
  );
}
