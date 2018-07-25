class SearchController < ApplicationController
  def index
    search = SearchService.create(search_params)
    results =  search.valid? ? search.find_results : {search:search}
    render json: results, status: 200
  end
end
