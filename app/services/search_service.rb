# class SearchService
#   attr_accessor :params, :meta, :query, :type, :errors, :results
#   include Pagy::Backend
#
#   def initialize(params)
#     @params = params
#     @query = params[:query]
#     @type = params[:type]
#     @errors = []
#     @results = []
#   end
#
#   def self.create(params)
#     self.new(params).tap { |s| s.validate_blank }
#   end
#
#   def validate_blank
#     add_error("A query is required.") if query.blank?
#   end
#
#   def find_results
#     case self.type
#     when ":r"
#       redirect_to recipe_search_url
#       # find_recipes
#     when ":i"
#       find_recipes_from_ingredients
#     when ":u"
#       find_users
#     end
#   end
#
#   def valid?
#     errors.blank?
#   end
#
#   def add_error(error)
#     errors.push(error)
#   end
#
#   private
#     def find_recipes
#       params = self.params
#       @meta, @results = pagy(Recipe.search(self.query), {items: 2})
#       validate_results("recipes")
#     end
#
#     def find_recipes_from_ingredients
#       ingredients = query_to_array.find_all do |i|
#         Ingredient.find_or_create_by(name:i.titleize)
#       end
#       @meta, @results = pagy(Recipe.with_ingredients(ingredient_ids(ingredients)))
#       validate_results("recipes")
#     end
#
#     def find_users
#       self.results = User.from_identifier(self.query)
#       validate_results("users")
#     end
#
#     def validate_results(type)
#       if !results.blank?
#         {results:results, meta:meta}
#       else
#         add_error("No #{type} found.")
#         {search:self}
#       end
#     end
#
#     def query_to_array
#       query.split(",").map{|i| i.strip}
#     end
#
#     def ingredient_ids(ingredients)
#       ingredients.map{|i| Ingredient.find_by_name(i.titleize).id}
#     end
# end
