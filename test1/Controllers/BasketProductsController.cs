using System;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using test1.Models;

namespace test1.Controllers
{
    public class BasketProductsController : Controller
    {
        private PateticoRPMEntities db = new PateticoRPMEntities();

        // GET: BasketProducts
        public ActionResult Index()
        {
            int ID_User = db.Users.Where(p => p.email == User.Identity.Name).FirstOrDefault().id_user;
            int IdBasket = db.Basket.Where(p => p.id_user == ID_User).FirstOrDefault().id_basket;
            var basketProduct = db.BasketProduct.Where(p => p.id_basket == IdBasket);
            ViewBag.Shops = new SelectList(db.Shops, "id_shop", "address");
            return View(basketProduct.ToList());
        }
        public ActionResult ChangeElement(string idProd, string amount)
        {
            int IdProd = Convert.ToInt32(idProd);
            int Amount = Convert.ToInt32(amount);
            decimal priceOne = Convert.ToDecimal(db.Products.Where(p => p.id_product == IdProd).FirstOrDefault().price);
            decimal newPrice = priceOne * Amount;
            int idUser = db.Users.Where(p => p.email == User.Identity.Name).FirstOrDefault().id_user;
            int idBasket = db.Basket.Where(p => p.id_user == idUser).FirstOrDefault().id_basket;
            var row = db.BasketProduct.Where(p => p.id_basket == idBasket && p.id_product == IdProd).FirstOrDefault();
            row.count = Amount;
            db.SaveChanges();
            return Json(new { newPrice });
        }
        // GET: BasketProducts/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            BasketProduct basketProduct = db.BasketProduct.Find(id);
            if (basketProduct == null)
            {
                return HttpNotFound();
            }
            return View(basketProduct);
        }

        // GET: BasketProducts/Create
        public ActionResult Create()
        {
            ViewBag.id_basket = new SelectList(db.Basket, "id_basket", "id_basket");
            ViewBag.id_product = new SelectList(db.Products, "id_product", "product_name");
            return View();
        }

        // POST: BasketProducts/Create
        // Чтобы защититься от атак чрезмерной передачи данных, включите определенные свойства, для которых следует установить привязку. Дополнительные 
        // сведения см. в статье https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]

        public ActionResult Create(string id, string count)
        {
            if (User.Identity.IsAuthenticated)
            {
                int ID = Convert.ToInt32(id);
                int Count = Convert.ToInt32(count);
                int idUser = db.Users.Where(p => p.email == User.Identity.Name).FirstOrDefault().id_user;
                int idBasket = db.Basket.Where(p => p.id_user == idUser).FirstOrDefault().id_basket;
                var Product = db.BasketProduct.Where(p => p.id_product == ID && p.id_basket == idBasket).FirstOrDefault();
                if (Product != null)
                {
                    bool fullCount = Count + Convert.ToInt32(Product.count) <= 10;
                    if (fullCount)
                    {
                        Product.count = Count + Convert.ToInt32(Product.count);
                        db.SaveChanges();
                        return Json(new { check = true, autorization = true });
                    }
                    else
                    {
                        return Json(new { check = false, autorization = true, amount = 10 - Convert.ToInt32(Product.count) });
                    }
                }
                else
                {
                    BasketProduct basketProduct = new BasketProduct { id_basket = idBasket, count = Count, id_product = ID };
                    db.BasketProduct.Add(basketProduct);
                    db.SaveChanges();
                    return Json(new { check = true, autorization = true });

                }
            }
            else
            {
                return Json(new { autorization = false });
            }

        }

        // GET: BasketProducts/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            BasketProduct basketProduct = db.BasketProduct.Find(id);
            if (basketProduct == null)
            {
                return HttpNotFound();
            }
            ViewBag.id_basket = new SelectList(db.Basket, "id_basket", "id_basket", basketProduct.id_basket);
            ViewBag.id_product = new SelectList(db.Products, "id_product", "product_name", basketProduct.id_product);
            return View(basketProduct);
        }

        // POST: BasketProducts/Edit/5
        // Чтобы защититься от атак чрезмерной передачи данных, включите определенные свойства, для которых следует установить привязку. Дополнительные 
        // сведения см. в статье https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "id_basket_product,count,id_product,id_basket")] BasketProduct basketProduct)
        {
            if (ModelState.IsValid)
            {
                db.Entry(basketProduct).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.id_basket = new SelectList(db.Basket, "id_basket", "id_basket", basketProduct.id_basket);
            ViewBag.id_product = new SelectList(db.Products, "id_product", "product_name", basketProduct.id_product);
            return View(basketProduct);
        }

        //public void CreateOrder(string pay, string point)
        //{
        //    int idUser = db.Users.Where(p => p.Email == User.Identity.Name).FirstOrDefault().ID_User;
        //    int idBasket = db.Baskets.Where(p => p.ID_User == idUser).FirstOrDefault().ID_Basket;
        //    PDFCreate(idBasket);
        //    Orders order = new Orders { ID_Basket = idBasket, ID_Pay = Convert.ToInt32(pay), ID_Status = 1, ID_Pharm = Convert.ToInt32(point) };
        //    db.Orders.Add(order);
        //    db.SaveChanges();
        //    db.Basket_Consist.RemoveRange(db.Basket_Consist.Where(x => x.ID_Basket == idBasket));
        //    db.SaveChanges();
        //    string path = Server.MapPath(Url.Content("~/Content/PDF/Consist.pdf"));
        //    SendEmailAsync(db.Users.Where(p => p.Email == User.Identity.Name).FirstOrDefault().Email, path);
        //}
        //private void SendEmailAsync(string Email, string path) // Метод для отправки сообщения и PDF-файла с содержимым заказа на почту клиенту
        //{
        //    try
        //    {


        //        MailAddress from = new MailAddress("mnadgafova47@gmail.com", "online-apteka 'Panaceya'");
        //        MailAddress to = new MailAddress(Email);
        //        MailMessage m = new MailMessage(from, to)
        //        {
        //            Subject = "Ваш заказ оформлен",
        //            Body = $"Ваш заказ оформлен, как только он будет готов, вам придет сообщение!"
        //        };
        //        m.Attachments.Add(new Attachment(path));

        //        m.IsBodyHtml = true;
        //        SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587)
        //        {
        //            EnableSsl = true,
        //            Credentials = new NetworkCredential("mnadgafova47@gmail.com", "3211q1q1q")
        //        };
        //        smtp.Send(m);
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //}
        //private void PDFCreate(int idBasket) // Метод для формирования PDF-фвйла с содержимым заказа
        //{
        //    try
        //    {
        //        var basket_Consist = db.Basket_Consist.Include(b => b.Baskets).Include(b => b.Medicines).Where(p => p.ID_Basket == idBasket);


        //        DataTable tableConsist = new DataTable();
        //        tableConsist.Columns.Add("Name");
        //        tableConsist.Columns.Add("Amount");
        //        tableConsist.Columns.Add("Price");
        //        decimal Price = 0;
        //        foreach (var item in basket_Consist)
        //        {
        //            Price += item.Price;
        //            DataRow row = tableConsist.NewRow();
        //            row["Name"] = item.Medicines.Name;
        //            row["Amount"] = item.Amount;
        //            row["Price"] = item.Price;
        //            tableConsist.Rows.Add(row);

        //        }
        //        string dest = Server.MapPath(Url.Content("~/Content/PDF/Consist.pdf"));
        //        PdfWriter writer = new PdfWriter(dest);
        //        PdfDocument pdfDoc = new PdfDocument(writer);
        //        Document document = new Document(pdfDoc);
        //        Table table = new Table(tableConsist.Columns.Count);
        //        PdfFont russian = PdfFontFactory.CreateFont(Server.MapPath(Url.Content("~/Content/Font/Arial.ttf")), "CP1251", true);
        //        document.SetFont(russian);
        //        table.SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);
        //        table.SetFontColor(new DeviceRgb(0, 0, 0));
        //        iText.Kernel.Colors.Color color = new DeviceRgb(255, 178, 204);
        //        CreateCell(table, "Название", 200, color);
        //        CreateCell(table, "Количество", 100, color);
        //        CreateCell(table, "Цена, руб", 100, color);

        //        for (int i = 0; i < tableConsist.Rows.Count; i++)
        //        {
        //            for (int j = 0; j < tableConsist.Columns.Count; j++)
        //            {
        //                Cell cell = new Cell();
        //                if (j == 2) cell.Add(new Paragraph(Convert.ToDecimal(tableConsist.Rows[i][j]).ToString().Remove(tableConsist.Rows[i][j].ToString().Length - 5, 5)));


        //                else cell.Add(new Paragraph(tableConsist.Rows[i][j].ToString()));
        //                cell.SetBackgroundColor(new DeviceRgb(255, 231, 244));
        //                cell.SetFontSize(7);
        //                table.AddCell(cell);
        //            }
        //        }
        //        iText.Layout.Element.Paragraph price = new Paragraph("Итого: " + " " + Price.ToString().Remove(Price.ToString().Length - 5, 5) + " руб.");
        //        document.Add(table);
        //        document.Add(price);
        //        document.Close();
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //    finally
        //    {

        //    }
        //}
        //private void CreateCell(Table table, string str, float widthCell, iText.Kernel.Colors.Color bgColor)
        //{
        //    Cell cell1 = new Cell();
        //    cell1.Add(new Paragraph(str));
        //    cell1.SetWidth(widthCell);
        //    cell1.SetFontSize(10);
        //    cell1.SetBackgroundColor(bgColor);
        //    table.AddCell(cell1);
        //}

        // GET: BasketProducts/Delete/5

        // POST: BasketProducts/Delete/5
        [HttpPost]
        public void Delete(string id)
        {
            int ID = Convert.ToInt32(id);
            int idUser = db.Users.Where(p => p.email == User.Identity.Name).FirstOrDefault().id_user;
            int idBasket = db.Basket.Where(p => p.id_user == idUser).FirstOrDefault().id_basket;
            BasketProduct basketProduct = db.BasketProduct.Where(p => p.id_product == ID && p.id_basket == idBasket).FirstOrDefault();
            db.BasketProduct.Remove(basketProduct);
            db.SaveChanges();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
