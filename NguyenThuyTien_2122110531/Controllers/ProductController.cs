using Microsoft.AspNetCore.Mvc;
using NguyenThuyTien_2122110531.Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NguyenThuyTien_2122110531.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        // Khởi tạo danh sách rỗng thay vì dữ liệu mẫu
        private static List<Product> _products = new List<Product>();

        // GET: api/Product - Lấy tất cả product
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetAll()
        {
            return Ok(_products);
        }

        // GET api/Product/5 - Lấy product theo ID
        [HttpGet("{id}")]
        public ActionResult<Product> GetById(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound("Không tìm thấy sản phẩm với ID này");
            }
            return Ok(product);
        }

        // POST api/Product - Thêm product mới
        [HttpPost]
        public ActionResult<Product> Create([FromBody] Product newProduct)
        {
            // Xử lý trường hợp danh sách rỗng
            newProduct.Id = _products.Any() ? _products.Max(p => p.Id) + 1 : 1;
            _products.Add(newProduct);

            // Trả về kết quả với status 201 Created
            return CreatedAtAction(nameof(GetById), new { id = newProduct.Id }, newProduct);
        }

        // PUT api/Product/5 - Cập nhật product
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Product updatedProduct)
        {
            var existingProduct = _products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound("Không tìm thấy sản phẩm để cập nhật");
            }

            // Cập nhật thông tin
            existingProduct.Name = updatedProduct.Name;
            existingProduct.Image = updatedProduct.Image;
            existingProduct.Price = updatedProduct.Price;

            return NoContent(); // Status 204 No Content
        }

        // DELETE api/Product/5 - Xóa product
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound("Không tìm thấy sản phẩm để xóa");
            }

            _products.Remove(product);
            return NoContent(); // Status 204 No Content
        }
    }
}